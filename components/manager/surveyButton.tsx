import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';

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
  return (
    <Link href={`/edit?id=${id}`}>
      <div className="flex cursor-pointer flex-col items-start rounded-md bg-gray-100 p-4 shadow-md">
        <h1 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold text-gray-700">
          {title}
        </h1>
        <h2 className="text-md w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-600">
          {description}
        </h2>
        <span className="mt-4 text-sm text-gray-500">{`Updated ${dayjs(
          modifiedDate
        ).fromNow()}`}</span>
      </div>
    </Link>
  );
};

export default SurveyButton;
