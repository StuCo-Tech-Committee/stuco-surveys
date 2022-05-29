import Head from 'next/head';
import CreateSurveyButton from '../components/manager/createSurveyButton';
import SurveyButton from '../components/manager/surveyButton';
import { server } from '../config';
import { ISurvey } from '../utilities/manager/SurveyManager';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BiLoaderAlt, BiFileBlank } from 'react-icons/bi';
import { GoLaw } from 'react-icons/go';

const Manager = () => {
  const [surveys, setSurveys] = useState<ISurvey[] | undefined>(undefined);

  const loadSurveys = useCallback(async () => {
    const surveys: ISurvey[] = await (
      await fetch(`${server}/api/surveys`)
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
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
                y: 0,
              },
              hidden: {
                transition: {
                  staggerChildren: 0.05,
                  staggerDirection: -1,
                },
                y: 10,
              },
            }}
            className="w-full bg-gray-100 px-4 py-6 md:px-32"
          >
            <motion.h1
              initial="hidden"
              animate="visible"
              className="text-xl font-semibold text-gray-800"
            >
              Create
            </motion.h1>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <CreateSurveyButton name="Blank" icon={<BiFileBlank />} />
              <CreateSurveyButton name="Motion" icon={<GoLaw />} />
              <CreateSurveyButton
                name="None of these do anything (yet)"
                icon={<GoLaw />}
              />
            </div>
          </motion.div>
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
            className="mx-4 flex flex-col gap-12 self-stretch py-6 md:mx-32"
          >
            {surveys.filter((survey) => {
              return survey.published === false;
            }).length > 0 ? (
              <div>
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
                </motion.div>
              </div>
            ) : (
              <></>
            )}
            {surveys.filter((survey) => {
              return survey.published === true;
            }).length > 0 ? (
              <div>
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
                  className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
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
                          modifiedDate={
                            new Date(Date.parse(survey.modifiedDate))
                          }
                          loadSurveys={loadSurveys}
                        />
                      );
                    })}
                </motion.div>
              </div>
            ) : (
              <></>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Manager;
