import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PopupMenu, PopupItem } from '../popupMenu';
import { BsTrash } from 'react-icons/bs';
import { server } from '../../config';

dayjs.extend(relativeTime);

const SurveyButton = ({
  id,
  title,
  description,
  modifiedDate,
  loadSurveys,
}: {
  id: string;
  title: string;
  description: string;
  modifiedDate: Date;
  loadSurveys: Function;
}) => {
  return (
    <Link href={`/edit/${id}`} scroll={false}>
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
        className="flex cursor-pointer flex-col items-start rounded-md bg-gray-50 p-4 outline outline-1 outline-gray-200 transition-colors hover:bg-gray-100"
      >
        <div className="flex w-full flex-row justify-between">
          <h1 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-semibold text-gray-700">
            {title}
          </h1>
          <PopupMenu>
            <PopupItem
              name="Delete"
              icon={<BsTrash />}
              action={async () => {
                await fetch(`${server}/api/survey?id=${id}`, {
                  method: 'DELETE',
                });
                loadSurveys();
              }}
            />
          </PopupMenu>
        </div>
        <h2 className="text-md w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
          {description}
        </h2>
        <span className="mt-4 text-sm font-light text-gray-500">{`Updated ${dayjs(
          modifiedDate
        ).fromNow()}`}</span>
      </motion.div>
    </Link>
  );
};

export default SurveyButton;
