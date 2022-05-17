import mongoose, { Document } from 'mongoose';

const uri = process.env.DB_URI as string;

mongoose.connect(uri);

interface ISurveyElement {
  id: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
  choices?: string[];
  range?: number[];
  step?: number;
  validator?: string;
}

interface ISurvey extends Document {
  name: string;
  description: string;
  published: string;
  createdDate: string;
  modifiedDate: string;
  elements: ISurveyElement[];
}

const SurveySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
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

const Survey =
  mongoose.models.Survey ||
  mongoose.model<ISurvey>('Survey', SurveySchema, 'survey-schemas');

class SurveyManager {
  static async createSurvey() {
    const newSurvey = new Survey({
      name: '',
      description: '',
      published: false,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });
    await newSurvey.save();
    return newSurvey;
  }

  static async getSurvey(id: string) {
    return await Survey.findById(id).exec();
  }

  static async updateSurvey(newSurvey: ISurvey) {
    return await Survey.findByIdAndUpdate(newSurvey._id, {
      ...newSurvey,
      modifiedDate: new Date(),
    }).exec();
  }

  static async getSurveys(published: boolean) {
    return await Survey.find({ published: published }).exec();
  }
}

export { SurveyManager };
export type { ISurvey, ISurveyElement };
