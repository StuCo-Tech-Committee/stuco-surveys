// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISurvey, SurveyManager } from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  await SurveyManager.updateSurvey(req.body as ISurvey);
  res.status(200).send('Okay');
}
