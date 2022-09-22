import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { NextRouter } from 'next/router';
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
  return (
    <button
      onClick={async () => {
        const surveyResponse = await fetch(`${server}/api/survey`, {
          method: 'POST',
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
        className="flex cursor-pointer flex-col items-start justify-start rounded-md bg-white p-4 outline outline-1 outline-gray-300 transition-colors hover:bg-gray-50"
      >
        {icon}
        <h1>{name}</h1>
      </motion.div>
    </button>
  );
};

export default CreateSurveyButton;
