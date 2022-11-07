// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import {
  createSurvey,
  deleteSurvey,
  getSurvey,
  ISurvey,
  updateSurvey,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey | { error: string } | null>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    if (!req.query.id)
      return res.status(400).send({ error: 'Query parameter "id" required' });
    res.status(200).json(await getSurvey(req.query.id as string));
    return;
  }

  switch (req.method) {
    case 'POST':
      if (!JSON.parse(req.body).creator)
        return res
          .status(400)
          .send({ error: 'Body parameter "creator" required' });

      res.status(200).json(await createSurvey(JSON.parse(req.body).creator));
      break;
    case 'PUT':
      if (!req.body)
        return res.status(400).send({ error: 'Request body required' });

      try {
        await updateSurvey(req.body, session.user.email);
        res.status(200).json(null);
      } catch {
        res.status(400).send({ error: 'Bad request' });
      }
      break;
    case 'DELETE':
      if (!req.query.id)
        return res.status(400).send({ error: 'Query parameter "id" required' });

      try {
        await deleteSurvey(req.query.id as string, session.user.email);
        res.status(200).send(null);
      } catch {
        res.status(400).send({ error: 'Bad request' });
      }
      break;
    default:
      res.status(405);
      break;
  }
}
