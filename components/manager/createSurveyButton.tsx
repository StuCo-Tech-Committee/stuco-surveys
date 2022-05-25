import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const CreateSurveyButton = ({
  name,
  icon,
}: {
  name: string;
  icon: ReactNode;
}) => {
  return (
    <Link href="/create" scroll={false}>
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
    </Link>
  );
};

export default CreateSurveyButton;
