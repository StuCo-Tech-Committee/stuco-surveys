import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';

const Create = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const surveyResponse = await fetch(`${server}/api/survey`, {
        method: 'POST',
      });

      if (!surveyResponse.ok) {
        router.push('/');
        return;
      }

      const survey = await surveyResponse.json();

      router.push(`/edit/${survey._id}`);
    })();
  }, [router]);

  return <div></div>;
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   const survey: ISurvey = await (
//     await fetch(`${server}/api/survey`, { method: 'POST' })
//   ).json();

//   return {
//     props: {
//       id: survey._id,
//       header: false,
//     },
//   };
// };

export default Create;
