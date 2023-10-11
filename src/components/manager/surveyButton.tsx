import { PopupItem, PopupMenu } from '@/components/popupMenu';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsTrash } from 'react-icons/bs';

dayjs.extend(relativeTime);

const SurveyButton = ({
  id,
  title,
  description,
  modifiedDate,
  refresh,
}: {
  id: string;
  title: string;
  description: string;
  modifiedDate: Date;
  refresh: Function;
}) => {
  return (
    <Link href={`/edit/${id}`} scroll={false} legacyBehavior>
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
        className="flex cursor-pointer flex-col items-start rounded-md border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
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
                await fetch(`/api/survey?id=${id}`, {
                  method: 'DELETE',
                });
                refresh();
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
