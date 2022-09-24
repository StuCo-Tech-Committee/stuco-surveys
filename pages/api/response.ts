import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import {
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; error?: string }>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  if (!session.user?.email) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  switch (req.method) {
    case 'POST':
      const { response, respondent } = JSON.parse(req.body) as {
        response: ISurveyResponse;
        respondent: string;
      };
      await SurveyManager.submitResponse(response, respondent);

      res.status(200).send({ success: true });

      break;
  }
}
