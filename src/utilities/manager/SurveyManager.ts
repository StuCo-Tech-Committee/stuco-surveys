import mongoose, { Document } from 'mongoose';
import pusher from '../Pusher';

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
  creator: string;
  description: string;
  identifiable: boolean;
  published: boolean;
  createdDate: string;
  modifiedDate: string;
  elements: ISurveyElement[];
}

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

type IPusherSurveyResponse = Omit<ISurveyResponse, 'answers'> & {
  answers: {
    choices?: string[] | null;
    number?: number | null;
    text?: string | null;
    file?: {
      name: string;
      fileType: string;
    };
  }[];
};

interface ISurveyRespondents extends Document {
  surveyId: string;
  respondents: string[];
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

// TODO: This entire file does not include
// data validation. That's an issue.
// As a matter of fact, all server-side
// functions do not perform data
// checking.
export async function createSurvey(creator: string): Promise<ISurvey> {
  const newSurvey = new Survey({
    name: '',
    creator: creator,
    description: '',
    identifiable: false,
    published: false,
    createdDate: new Date(),
    modifiedDate: new Date(),
  });
  await newSurvey.save();
  return newSurvey;
}

export async function getSurvey(id: string): Promise<ISurvey> {
  return Survey.findById(id).exec();
}

export async function updateSurvey(
  newSurvey: ISurvey,
  creator: string
): Promise<void> {
  const survey = await Survey.findById(newSurvey._id).exec();
  if (survey == null) {
    throw new Error('Survey not found');
  }
  if (survey.creator !== creator) {
    throw new Error('Not authorized');
  }

  await Survey.findByIdAndUpdate(newSurvey._id, {
    ...newSurvey,
    modifiedDate: new Date(),
  }).exec();
}

export async function deleteSurvey(id: string, creator: string): Promise<void> {
  const survey = await Survey.findById(id).exec();
  if (survey == null) {
    throw new Error('Survey not found');
  }
  if (survey.creator !== creator) {
    throw new Error('Not authorized');
  }

  await Survey.findByIdAndDelete(id).exec();
  await SurveyRespondents.findOneAndDelete({ surveyId: id }).exec();
  await SurveyResponse.deleteMany({ surveyId: id }).exec();
}

export async function publishSurvey(id: string): Promise<void> {
  const newSurveyRespondents = new SurveyRespondents({
    surveyId: id,
    respondents: [],
  });
  await newSurveyRespondents.save();

  await Survey.findByIdAndUpdate(id, {
    published: true,
  }).exec();
}

export async function getSurveys(
  creator: string,
  type: 'all' | 'published' | 'unpublished'
): Promise<ISurvey[]> {
  let query = Survey.find({ creator: creator });
  if (type == 'published') {
    query = query.where('published').equals(true);
  } else if (type == 'unpublished') {
    query = query.where('published').equals(false);
  }
  return query.exec();
}

export async function submitResponse(
  response: ISurveyResponse,
  respondent: string
): Promise<void> {
  if (await checkResponded(response.surveyId, respondent)) {
    throw new Error('Already responded');
  }

  pusher
    .trigger(response.surveyId, 'new-response', {
      ...response,
      answers: response.answers.map((answer) => {
        return {
          ...answer,
          ...(answer.file && {
            file: {
              name: answer.file?.name,
              fileType: answer.file?.fileType,
            },
          }),
        };
      }),
    } as IPusherSurveyResponse)
    .catch((err) => {
      console.error(err);
    });

  const identifiable = ((await getSurvey(response.surveyId)) as ISurvey)
    .identifiable;

  const responseObject = {
    ...response,
    respondent: identifiable ? respondent : undefined,
    date: new Date().toString(),
  } as ISurveyResponse;
  const newResponse = new SurveyResponse(responseObject);
  await newResponse.save();

  const surveyRespondents = await SurveyRespondents.findOne({
    surveyId: response.surveyId,
  }).exec();
  if (surveyRespondents) {
    surveyRespondents.respondents.push(respondent);
    await surveyRespondents.save();
  }
}

export async function getResponses(id: string): Promise<ISurveyResponse[]> {
  return SurveyResponse.find({ surveyId: id }).exec();
}

export async function checkResponded(
  id: string,
  respondent: string
): Promise<boolean> {
  const surveyRespondents = await SurveyRespondents.findOne({
    surveyId: id,
  }).exec();

  if (surveyRespondents) {
    return surveyRespondents.respondents.includes(respondent);
  } else {
    return false;
  }
}

export type { ISurvey, ISurveyElement, ISurveyResponse, IPusherSurveyResponse };
