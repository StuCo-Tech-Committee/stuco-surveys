// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import authorized from '../../authorized';
import { ISurvey, SurveyManager } from '../../utilities/manager/SurveyManager';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey[] | { error: string }>
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

  // Anyone can see a survey, but only authorized users can edit it.
  if (req.method === 'GET') {
    if (!req.query.id)
      return res.status(400).send({ error: 'Query parameter "id" required' });
    res.status(200).json(await SurveyManager.getSurvey(req.query.id as string));
    return;
  }

  if (!authorized.includes(session.user.email)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  switch (req.method) {
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
