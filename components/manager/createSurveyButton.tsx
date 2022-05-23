import Link from 'next/link';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const CreateSurveyButton = () => {
  return (
    <Link href="/create" scroll={false}>
      <motion.div
        variants={{
          hidden: {
            y: 20,
            opacity: 0,
          },
          visible: {
            y: 0,
            opacity: 1,
          },
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
