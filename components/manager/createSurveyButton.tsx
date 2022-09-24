import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { NextRouter } from 'next/router';
import { ReactNode } from 'react';
import { server } from '../../config';

const CreateSurveyButton = ({
  name,
  icon,
  router,
}: {
  name: string;
  icon: ReactNode;
  router: NextRouter;
}) => {
  const { data: session } = useSession();

  return (
    <button
      onClick={async () => {
        if (!session?.user?.email) {
          router.push('/');
          return;
        }

        const surveyResponse = await fetch(`${server}/api/survey`, {
          method: 'POST',
          body: JSON.stringify({
            creator: session?.user?.email,
          }),
        });

        if (!surveyResponse.ok) {
          router.push('/');
          return;
        }

        const survey = await surveyResponse.json();

        router.push(`/edit/${survey._id}`);
      }}
    >
      <motion.div
        variants={{
          hidden: {
            y: 10,
            opacity: 0,
          },
          visible: {
            y: 0,
            opacity: 1,
          },
        }}
        className="flex cursor-pointer flex-col items-start justify-start rounded-md border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50"
      >
        {icon}
        <h1>{name}</h1>
      </motion.div>
    </button>
  );
};

export default CreateSurveyButton;
