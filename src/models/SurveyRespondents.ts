import mongoose, { Document } from 'mongoose';

interface ISurveyRespondents extends Document {
  surveyId: string;
  respondents: string[];
}

const SurveyRespondentsSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  respondents: {
    type: [String],
    required: true,
  },
});

export const SurveyRespondents =
  mongoose.models.SurveyRespondents ||
  mongoose.model<ISurveyRespondents>(
    'SurveyRespondents',
    SurveyRespondentsSchema,
    'survey-respondents'
  );
