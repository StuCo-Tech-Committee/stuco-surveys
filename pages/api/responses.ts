import { NextApiRequest, NextApiResponse } from 'next';
import {
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurveyResponse[] | { error: string }>
) {
  switch (req.method) {
    case 'GET':
      if (!req.query.id)
        return res.status(400).send({ error: 'Query parameter "id" required' });

      const responses = await SurveyManager.getResponses(
        req.query.id as string
      );

      res.status(200).send(responses);

      break;
  }
}
