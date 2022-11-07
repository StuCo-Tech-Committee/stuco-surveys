import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { getSurveys, ISurvey } from '../../utilities/manager/SurveyManager';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ISurvey[] | { error: string }>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const publishType = req.query.publishType as
    | 'all'
    | 'published'
    | 'unpublished';

  if (publishType) {
    res.status(200).json(await getSurveys(session.user.email, publishType));
    return;
  } else {
    res.status(400).send({ error: 'Bad request' });
    return;
  }
}
