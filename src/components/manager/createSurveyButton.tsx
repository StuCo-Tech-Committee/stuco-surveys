import { useSession } from 'next-auth/react';
import { NextRouter } from 'next/router';
import { ReactNode } from 'react';

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

        const surveyResponse = await fetch(`/api/survey`, {
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
      <div className="flex cursor-pointer flex-col items-start justify-start rounded-md border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-50">
        {icon}
        <h1>{name}</h1>
      </div>
    </button>
  );
};

export default CreateSurveyButton;
