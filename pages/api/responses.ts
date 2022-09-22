import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import authorized from '../../authorized';
import {
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurveyResponse[] | { error: string }>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!session.user?.email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!authorized.includes(session.user.email)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

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
