// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
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

  if (!authorized.includes(session.user.email)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const publishType = req.query.publishType as
    | 'all'
    | 'published'
    | 'unpublished';

  if (publishType) {
    res
      .status(200)
      .json(await SurveyManager.getSurveys(session.user.email, publishType));
    return;
  } else {
    res.status(400).send({ error: 'Bad request' });
    return;
  }
}
