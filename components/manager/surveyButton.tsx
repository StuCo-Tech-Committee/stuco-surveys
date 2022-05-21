import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

dayjs.extend(relativeTime);

const SurveyButton = ({
  id,
  title,
  description,
  modifiedDate,
}: {
  id: string;
  title: string;
  description: string;
  modifiedDate: Date;
}) => {
  const [tapped, setTapped] = useState(false);

  return (
    <Link href={`/edit/${id}`} scroll={false}>
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
        className="flex cursor-pointer flex-col items-start rounded-md bg-gray-100 p-4 shadow-md"
      >
        <h1 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold text-gray-700">
          {title}
        </h1>
        <h2 className="text-md w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-600">
          {description}
        </h2>
        <span className="mt-4 text-sm text-gray-500">{`Updated ${dayjs(
          modifiedDate
        ).fromNow()}`}</span>
      </motion.div>
    </Link>
  );
};

export default SurveyButton;
