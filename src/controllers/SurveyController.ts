import mongoose from 'mongoose';
import { ISurvey, ISurveyElement, Survey } from '../models/Survey';
import { SurveyRespondents } from '../models/SurveyRespondents';
import { ISurveyResponse, SurveyResponse } from '../models/SurveyResponse';
import pusher from '../utilities/Pusher';
import { z } from 'zod';
import * as Schemas from '../schemas/Schemas';

const uri = process.env.DB_URI as string;

mongoose.connect(uri);

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

// TODO: This entire file does not include
// data validation. That's an issue.
// As a matter of fact, all server-side
// functions do not perform data
// checking.

// TODO: data validation is being implemented, but returning an error must have corresponding client side handling
export async function createSurvey(creator: string): Promise<ISurvey> {
  try {
    Schemas.creatorSchema.parse(creator);
  } catch (err) {
    throw new Error('Invalid creator');
  }

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
  try {
    Schemas.idSchema.parse(id);
  } catch (err) {
    throw new Error('Invalid id');
  }

  return Survey.findById(id).exec();
}

export async function updateSurvey(
  newSurvey: ISurvey,
  creator: string
): Promise<void> {
  try {
    Schemas.surveySchema.parse(newSurvey);
    Schemas.creatorSchema.parse(creator);
  } catch (err) {
    throw new Error('Invalid survey or creator');
  }

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
  try {
    Schemas.idSchema.parse(id);
    Schemas.creatorSchema.parse(creator);
  } catch (err) {
    throw new Error('Invalid id or creator');
  }

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
  try {
    Schemas.idSchema.parse(id);
  } catch (err) {
    throw new Error('Invalid id');
  }

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
  try {
    Schemas.creatorSchema.parse(creator);
  } catch (err) {
    throw new Error('Invalid creator');
  }

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

export type { ISurvey, ISurveyResponse, IPusherSurveyResponse, ISurveyElement };
