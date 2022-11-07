import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { BiFileBlank, BiLoaderAlt } from 'react-icons/bi';
import authorized from '../authorized';
import CreateSurveyButton from '../components/manager/createSurveyButton';
import SurveyButton from '../components/manager/surveyButton';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';
import { authOptions } from './api/auth/[...nextauth]';

const Manager = () => {
  const router = useRouter();
  const [surveys, setSurveys] = useState<ISurvey[] | undefined>(undefined);

  const loadSurveys = useCallback(async () => {
    const surveys: ISurvey[] = await (
      await fetch(`${server}/api/surveys?publishType=all`)
    ).json();

    setSurveys(surveys);
  }, []);

  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden pb-20">
      <Head>
        <title>StuCo Surveys - Manager</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!surveys ? (
        <div className="mx-4 flex flex-row items-center justify-center self-stretch py-6 md:mx-32">
          <h1 className="flex flex-col items-center justify-center gap-1 text-gray-600">
            <BiLoaderAlt className="animate-spin text-xl" />
            Getting surveys...
          </h1>
        </div>
      ) : (
        <>
          <div className="w-full bg-gray-100 px-4 py-6 md:px-32">
            <h1 className="text-xl font-semibold text-gray-800">Create</h1>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <CreateSurveyButton
                router={router}
                name="Blank"
                icon={<BiFileBlank />}
              />
            </div>
          </div>
          <div className="mx-4 flex flex-col gap-12 self-stretch py-6 md:mx-32">
            {surveys.filter((survey) => {
              return survey.published === false;
            }).length > 0 ? (
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Drafts</h1>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {surveys
                    .sort(
                      (a, b) =>
                        new Date(Date.parse(b.modifiedDate)).getTime() -
                        new Date(Date.parse(a.modifiedDate)).getTime()
                    )
                    .filter((survey) => {
                      return survey.published === false;
                    })
                    .map((survey) => {
                      return (
                        <SurveyButton
                          key={survey._id}
                          id={survey._id}
                          title={survey.name || 'Untitled Survey'}
                          description={survey.description || 'No description'}
                          modifiedDate={
                            new Date(Date.parse(survey.modifiedDate))
                          }
                          loadSurveys={loadSurveys}
                        />
                      );
                    })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {surveys.filter((survey) => {
              return survey.published === true;
            }).length > 0 ? (
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Published
                </h1>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {surveys
                    .sort(
                      (a, b) =>
                        new Date(Date.parse(b.modifiedDate)).getTime() -
                        new Date(Date.parse(a.modifiedDate)).getTime()
                    )
                    .filter((survey) => {
                      return survey.published === true;
                    })
                    .map((survey) => {
                      return (
                        <SurveyButton
                          key={survey._id}
                          id={survey._id}
                          title={survey.name || 'Untitled Survey'}
                          description={survey.description || 'No description'}
                          modifiedDate={
                            new Date(Date.parse(survey.modifiedDate))
                          }
                          loadSurveys={loadSurveys}
                        />
                      );
                    })}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const session = await getSession(context);
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!authorized.includes(session?.user?.email ?? '')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      header: true,
    },
  };
};

export default Manager;
