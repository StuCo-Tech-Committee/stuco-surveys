import { publishSurvey } from '@/controllers/survey.controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; error?: string }>
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.email) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  switch (req.method) {
    case 'POST':
      if (!req.query.id)
        return res
          .status(400)
          .send({ success: false, error: 'Query parameter "id" required' });

      await publishSurvey(req.query.id as string);

      res.status(200).send({ success: true });

      break;
  }
}
