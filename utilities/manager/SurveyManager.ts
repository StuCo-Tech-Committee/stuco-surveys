import mongoose, { Document, ObjectId } from 'mongoose';

const uri = process.env.DB_URI as string;

mongoose.connect(uri);

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
  description: string;
  published: boolean;
  createdDate: string;
  modifiedDate: string;
  elements: ISurveyElement[];
}

interface ISurveyResponse extends Document {
  surveyId: string;
  date: string;
  answers: {
    choices?: string[] | null;
    number?: number | null;
    text?: string | null;
  }[];
}

interface ISurveyRespondents extends Document {
  surveyId: string;
  respondents: string[];
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

const SurveyResponseSchema = new mongoose.Schema({
  surveyId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  answers: {
    type: [
      {
        choices: [String],
        number: Number,
        text: String,
      },
    ],
    required: true,
  },
});

const SurveyRespondentsSchema = new mongoose.Schema({
  surveyId: {
    type: String,
    required: true,
  },
  respondents: {
    type: [String],
    required: true,
  },
});

const Survey =
  mongoose.models.Survey ||
  mongoose.model<ISurvey>('Survey', SurveySchema, 'survey-schemas');

const SurveyResponse =
  mongoose.models.SurveyResponse ||
  mongoose.model<ISurveyResponse>(
    'SurveyResponse',
    SurveyResponseSchema,
    'survey-responses'
  );

const SurveyRespondents =
  mongoose.models.SurveyRespondents ||
  mongoose.model<ISurveyRespondents>(
    'SurveyRespondents',
    SurveyRespondentsSchema,
    'survey-respondents'
  );

// TODO: This entire class does not include
// data validation. That's an issue.
// As a matter of fact, all server-side
// functions do not perform data
// checking.
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

  static async deleteSurvey(id: string) {
    return await Survey.findByIdAndDelete(id).exec();
  }

  static async publishSurvey(id: string) {
    const newSurveyRespondents = new SurveyRespondents({
      surveyId: id,
      respondents: [],
    });
    await newSurveyRespondents.save();

    return await Survey.findByIdAndUpdate(id, {
      published: true,
    }).exec();
  }

  static async getSurveys(published?: boolean) {
    if (typeof published === 'undefined') {
      return await Survey.find().exec();
    } else if (published === true) {
      return await Survey.find({ published: true }).exec();
    } else {
      return await Survey.find({ published: false }).exec();
    }
  }

  static async submitResponse(response: ISurveyResponse, respondent: string) {
    const newResponse = new SurveyResponse({
      ...response,
      date: new Date().toString(),
    } as ISurveyResponse);
    await newResponse.save();

    const surveyRespondents = await SurveyRespondents.findOne({
      surveyId: response.surveyId,
    }).exec();
    if (surveyRespondents) {
      surveyRespondents.respondents.push(respondent);
      await surveyRespondents.save();
    }

    return newResponse;
  }

  static async getResponses(id: string) {
    return await SurveyResponse.find({ surveyId: id }).exec();
  }

  static async checkResponded(id: string, respondent: string) {
    const surveyRespondents = await SurveyRespondents.findOne({
      surveyId: id,
    }).exec();

    if (surveyRespondents) {
      return surveyRespondents.respondents.includes(respondent);
    } else {
      return false;
    }
  }
}

export { SurveyManager };
export type { ISurvey, ISurveyElement, ISurveyResponse };
