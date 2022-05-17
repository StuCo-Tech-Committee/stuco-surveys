// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISurvey, SurveyManager } from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey>
) {
  const survey = await SurveyManager.createSurvey();
  res.status(200).json(survey);
}
