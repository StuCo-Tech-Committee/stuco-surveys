import {
  ISurveyResponse,
  submitResponse,
} from '@/controllers/survey.controller';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

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
      const response = JSON.parse(req.body) as ISurveyResponse;
      const newResponse = {
        ...response,
        answers: response.answers.map((answer) => {
          if (answer.file) {
            return {
              ...answer,
              file: {
                ...answer.file,
                data: Buffer.from(answer.file.data),
              },
            };
          }

          return answer;
        }),
      } as ISurveyResponse;

      try {
        await submitResponse(newResponse, session.user.email);

        res.status(200).send({ success: true });
      } catch (error) {
        console.error(error);
        res.status(400).send({ success: false, error: 'Bad request' });
      }

      break;
  }
}
