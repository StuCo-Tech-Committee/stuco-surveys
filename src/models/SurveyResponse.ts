import mongoose, { Document } from 'mongoose';

interface ISurveyResponse extends Document {
  surveyId: string;
  date: string;
  respondent?: string;
  answers: {
    choices?: string[] | null;
    number?: number | null;
    text?: string | null;
    file?: {
      name: string;
      fileType: string;
      data: Buffer;
    };
  }[];
}

const SurveyResponseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  respondent: {
    type: String,
    required: false,
  },
  answers: {
    type: [
      {
        choices: [String],
        number: Number,
        text: String,
        file: {
          type: {
            name: String,
            fileType: String,
            data: Buffer,
          },
        },
      },
    ],
    required: true,
  },
});

export const SurveyResponse =
  mongoose.models.SurveyResponse ||
  mongoose.model<ISurveyResponse>(
    'SurveyResponse',
    SurveyResponseSchema,
    'survey-responses'
  );