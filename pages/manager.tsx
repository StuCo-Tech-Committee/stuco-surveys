import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../components/header';
import CreateSurveyButton from '../components/manager/createSurveyButton';
import SurveyButton from '../components/manager/surveyButton';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';

const Manager = ({
  published,
  unpublished,
}: {
  published: ISurvey[];
  unpublished: ISurvey[];
}) => {
  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>StuCo Surveys - Manager</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="mx-4 h-screen self-stretch pt-20 md:mx-32">
        <h1 className="text-xl font-semibold text-gray-800">Drafts</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <CreateSurveyButton />
          {unpublished
            .sort(
              (a, b) =>
                new Date(Date.parse(b.modifiedDate)).getTime() -
                new Date(Date.parse(a.modifiedDate)).getTime()
            )
            .map((survey) => {
              return (
                <SurveyButton
                  key={survey._id}
                  id={survey._id}
                  title={survey.name || 'Untitled Survey'}
                  description={survey.description || 'No description'}
                  modifiedDate={new Date(Date.parse(survey.modifiedDate))}
                />
              );
            })}
        </div>
        <h1 className="mt-12 text-xl font-semibold text-gray-800">Published</h1>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {published
            .sort(
              (a, b) =>
                new Date(Date.parse(b.modifiedDate)).getTime() -
                new Date(Date.parse(a.modifiedDate)).getTime()
            )
            .map((survey) => {
              return (
                <SurveyButton
                  key={survey._id}
                  id={survey._id}
                  title={survey.name || 'Untitled Survey'}
                  description={survey.description || 'No description'}
                  modifiedDate={new Date(Date.parse(survey.modifiedDate))}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const published: ISurvey[] = await (
    await fetch(`${server}/api/surveys?published=1`)
  ).json();
  const unpublished: ISurvey[] = await (
    await fetch(`${server}/api/surveys?published=0`)
  ).json();

  return {
    props: {
      published: published,
      unpublished: unpublished,
    },
  };
};

export default Manager;
