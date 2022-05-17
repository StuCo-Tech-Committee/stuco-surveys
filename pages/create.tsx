import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';

const Create = ({ id }: { id: string }) => {
  const router = useRouter();
  router.push(`/edit?id=${id}`);

  return (
    <div className="flex h-screen w-screen flex-row items-center justify-center">
      <h1 className="text-lg">Creating new survey...</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const survey: ISurvey = await (
    await fetch(`${server}/api/createSurvey`)
  ).json();

  return {
    props: {
      id: survey._id,
    },
  };
};

export default Create;
