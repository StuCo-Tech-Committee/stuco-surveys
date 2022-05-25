import Head from 'next/head';
import CreateSurveyButton from '../components/manager/createSurveyButton';
import SurveyButton from '../components/manager/surveyButton';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const Manager = () => {
  const [surveys, setSurveys] = useState<ISurvey[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const surveys: ISurvey[] = await (
        await fetch(`${server}/api/surveys`)
      ).json();

      setSurveys(surveys);
    })();
  }, []);

  return (
    <div className="flex w-full flex-col overflow-x-hidden">
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
          <motion.h1
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center gap-1 text-gray-600"
            variants={{
              visible: {
                opacity: 1,
                y: 0,
              },
              hidden: {
                opacity: 0,
                y: 20,
              },
            }}
          >
            <BiLoaderAlt className="animate-spin text-xl" />
            Getting surveys...
          </motion.h1>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
            hidden: {
              transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
              },
            },
          }}
          className="mx-4 self-stretch py-6 md:mx-32"
        >
          <motion.h1
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
            className="text-xl font-semibold text-gray-800"
          >
            Drafts
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.02,
                },
              },
              hidden: {
                transition: {
                  staggerChildren: 0.015,
                  staggerDirection: -1,
                },
              },
            }}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            <CreateSurveyButton />
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
                    modifiedDate={new Date(Date.parse(survey.modifiedDate))}
                  />
                );
              })}
          </motion.div>
          <motion.h1
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
            className="mt-12 text-xl font-semibold text-gray-800"
          >
            Published
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
              hidden: {
                transition: {
                  staggerChildren: 0.025,
                  staggerDirection: -1,
                },
              },
            }}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
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
                    modifiedDate={new Date(Date.parse(survey.modifiedDate))}
                  />
                );
              })}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Manager;
