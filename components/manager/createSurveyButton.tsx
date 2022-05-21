import Link from 'next/link';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CreateSurveyButton = () => {
  const [tapped, setTapped] = useState(false);

  return (
    <Link href="/create" scroll={false}>
      <motion.div
        variants={
          !tapped
            ? {
                hidden: {
                  y: 20,
                  opacity: 0,
                },
                visible: {
                  y: 0,
                  opacity: 1,
                },
              }
            : {}
        }
        animate={
          tapped
            ? {
                scale: 1.3,
                y: 0,
                opacity: 0,
                transition: {
                  ease: 'circOut',
                  duration: 0.4,
                },
              }
            : {
                y: 0,
                opacity: 1,
              }
        }
        onTap={() => {
          setTapped(true);
        }}
        className="flex cursor-pointer flex-row items-center justify-center rounded-md bg-gray-100 p-4 shadow-md"
      >
        <AiOutlinePlusCircle size={20} className="text-gray-700" />
        <h1 className="ml-2 text-lg font-bold text-gray-700">Create</h1>
      </motion.div>
    </Link>
  );
};

export default CreateSurveyButton;
