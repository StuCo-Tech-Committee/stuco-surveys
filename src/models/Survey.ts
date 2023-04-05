import mongoose, { Document } from 'mongoose';

interface ISurveyElement {
  id: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  choices?: string[];
  range?: (number | undefined)[];
  step?: number;
  validator?: string;
}

interface ISurvey extends Document {
  name: string;
  creator: string;
  description: string;
  identifiable: boolean;
  published: boolean;
  createdDate: string;
  modifiedDate: string;
  elements: ISurveyElement[];
}

const SurveySchema = new mongoose.Schema({
  name: { type: String },
  creator: { type: String, required: true },
  description: { type: String },
  identifiable: { type: Boolean, default: false, required: true },
  published: { type: Boolean },
  createdDate: { type: Date, required: true },
  modifiedDate: { type: Date, required: true },
  elements: {
    type: [
      {
        id: { type: String, required: true },
        type: {
          type: String,
          enum: ['multiple-choice', 'checkboxes', 'slider', 'free-response'],
          required: true,
        },
        title: { type: String, required: false },
        description: { type: String, required: false },
        required: { type: Boolean, required: true },

        // BEGIN ELEMENT TYPE-SPECIFIC PROPERTIES

        // Multiple choice + checkboxes
        choices: {
          type: [String],
          default: undefined,
          required: function () {
            return ['multiple-choice', 'checkboxes'].includes(
              (this as any).type
            );
          },
          validate: {
            validator: function (v: string[]) {
              return v.length >= 2;
            },
          },
        },

        // Slider
        range: {
          type: [Number],
          default: undefined,
          required: function () {
            return (this as any).type == 'slider';
          },
          validate: {
            validator: function (v: number[]) {
              return v.length == 2 && v[1] > v[0];
            },
          },
        },
        step: {
          type: Number,
          required: function () {
            return (this as any).type == 'slider';
          },
          validate: {
            validator: function (v: number) {
              return v >= 0;
            },
          },
        },

        // Free response
        validator: {
          type: String,
          required: function () {
            return (this as any).type == 'free-response';
          },
        },
      },
    ],
    required: true,
  },
});

export const Survey =
  mongoose.models.Survey ||
  mongoose.model<ISurvey>('Survey', SurveySchema, 'survey-schemas');
