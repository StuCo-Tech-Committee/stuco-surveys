// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { ISurvey, SurveyManager } from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey[] | { error: string }>
) {
  switch (req.method) {
    case 'GET':
      if (!req.query.id)
        return res.status(400).send({ error: 'Query parameter "id" required' });
      res
        .status(200)
        .json(await SurveyManager.getSurvey(req.query.id as string));
      break;
    case 'POST':
      res.status(200).json(await SurveyManager.createSurvey());
      break;
    case 'PUT':
      if (!req.body)
        return res.status(400).send({ error: 'Request body required' });
      res
        .status(200)
        .send(await SurveyManager.updateSurvey(req.body as ISurvey));
      break;
    case 'DELETE':
      if (!req.query.id)
        return res.status(400).send({ error: 'Query parameter "id" required' });
      res
        .status(200)
        .send(await SurveyManager.deleteSurvey(req.query.id as string));
      break;
    default:
      res.status(405);
      break;
  }
}
