import { NextApiRequest, NextApiResponse } from 'next';
import { SurveyManager } from '../../utilities/manager/SurveyManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; error?: string }>
) {
  switch (req.method) {
    case 'POST':
      if (!req.query.id)
        return res
          .status(400)
          .send({ success: false, error: 'Query parameter "id" required' });

      await SurveyManager.publishSurvey(req.query.id as string);

      res.status(200).send({ success: true });

      break;
  }
}
