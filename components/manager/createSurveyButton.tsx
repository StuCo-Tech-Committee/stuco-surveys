import Link from 'next/link';
import { AiOutlinePlusCircle } from 'react-icons/ai';

const CreateSurveyButton = () => {
  return (
    <Link href="/create">
      <div className="flex cursor-pointer flex-row items-center justify-center rounded-md bg-gray-100 p-4 shadow-md">
        <AiOutlinePlusCircle size={20} className="text-gray-700" />
        <h1 className="ml-2 text-lg font-bold text-gray-700">Create</h1>
      </div>
    </Link>
  );
};

export default CreateSurveyButton;
