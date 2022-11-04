import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import {
  ISurvey,
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
      const response = JSON.parse(req.body) as ISurveyResponse;

      try {
        await SurveyManager.submitResponse(response, session.user.email);

        res.status(200).send({ success: true });
      } catch {
        res.status(400).send({ success: false, error: 'Bad request' });
      }

      break;
  }
}
