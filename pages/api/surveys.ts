// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISurvey, SurveyManager } from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey[] | { error: string }>
) {
  let surveys: ISurvey[];

  if (!req.query.published) {
    surveys = await SurveyManager.getSurveys();
  } else if (req.query.published == '1') {
    surveys = await SurveyManager.getSurveys(true);
  } else if (req.query.published == '0') {
    surveys = await SurveyManager.getSurveys(false);
  } else {
    res.status(400).send({ error: 'Bad request' });
    return;
  }

  res.status(200).json(surveys);
}
