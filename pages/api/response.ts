import { NextApiRequest, NextApiResponse } from 'next';
import {
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';
import PusherManager from '../../utilities/PusherManager';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; error?: string }>
) {
  switch (req.method) {
    case 'POST':
      const response = JSON.parse(req.body) as ISurveyResponse;
      await SurveyManager.submitResponse(response);
      PusherManager.push(response.surveyId, 'new-response', response);

      res.status(200).send({ success: true });

      break;
  }
}
