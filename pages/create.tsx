import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';

const Create = ({ id }: { id: string }) => {
  const router = useRouter();
  router.push(`/edit/${id}`);

  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const survey: ISurvey = await (
    await fetch(`${server}/api/survey`, { method: 'POST' })
  ).json();

  return {
    props: {
      id: survey._id,
      header: false,
    },
  };
};

export default Create;
