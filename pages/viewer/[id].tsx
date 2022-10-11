import { useChannel, useEvent } from '@harelpls/use-pusher';
import { AnimatePresence, motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { VictoryBar, VictoryChart, VictoryPie } from 'victory';
import authorized from '../../authorized';
import {
  ISurvey,
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from '../api/auth/[...nextauth]';

const Viewer = ({
  survey,
  _responses,
}: {
  survey: ISurvey;
  _responses: ISurveyResponse[];
}) => {
  const [responses, setResponses] = useState<ISurveyResponse[]>(
    _responses.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
  );
  const channel = useChannel(survey._id);
  useEvent(channel, 'new-response', (response: ISurveyResponse | undefined) => {
    if (typeof response === 'undefined') return;

    setResponses([response, ...responses]);
  });

  return (
    <>
      <Head>
        <title>{survey.name}</title>
      </Head>
      <div className="h-screen w-screen overflow-hidden p-12">
        <div className="relative h-full w-full">
          {survey.elements.map((element, index) => {
            return (
              <Rnd
                key={element.id}
                resizeGrid={[20, 20]}
                dragGrid={[20, 20]}
                bounds="parent"
                className="rounded-lg bg-gray-100 p-8 shadow-md"
              >
                <h1 className="text-2xl">{element.title}</h1>
                <h1 className="text-lg text-gray-600">{element.description}</h1>
                {element.type === 'multiple-choice' && (
                  <VictoryPie
                    data={survey.elements[index].choices!.map((choice) => {
                      return {
                        x: choice,
                        y: responses.reduce<number>((prev, response) => {
                          return response.answers[index].choices?.includes(
                            choice
                          )
                            ? prev + 1
                            : prev;
                        }, 0),
                      };
                    })}
                    // animate={{ duration: 1000, easing: 'circleOut' }}
                  />
                )}
                {element.type === 'slider' && (
                  <VictoryChart>
                    <VictoryBar
                      data={responses
                        .map((response) => response.answers[index].number)
                        .filter(
                          (value, index, self) => self.indexOf(value) === index
                        )
                        .map((number) => {
                          return {
                            x: number,
                            y: responses.reduce<number>((prev, response) => {
                              return response.answers[index].number === number
                                ? prev + 1
                                : prev;
                            }, 0),
                          };
                        })}
                      // animate={{ duration: 1000, easing: 'circleOut' }}
                    />
                  </VictoryChart>
                )}
                {element.type === 'free-response' && (
                  <motion.div className="mt-4 flex flex-col gap-6">
                    <AnimatePresence>
                      {[...responses].slice(0, 4).map((response) => {
                        return (
                          <motion.h1
                            initial={{
                              y: -20,
                              opacity: 0,
                            }}
                            animate={{
                              y: 0,
                              opacity: 1,
                            }}
                            layout="position"
                            key={response._id}
                            className="text-2xl font-bold italic"
                          >
                            {`"${response.answers[index].text}"`}
                          </motion.h1>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Rnd>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (!authorized.includes(session?.user?.email ?? '')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (!context.query.id) {
    return {
      notFound: true,
    };
  }

  const survey = JSON.parse(
    JSON.stringify(await SurveyManager.getSurvey(context.query.id as string))
  );
  const responses = JSON.parse(
    JSON.stringify(await SurveyManager.getResponses(context.query.id as string))
  );

  if (!survey || !responses) {
    return {
      notFound: true,
    };
  }

  if (survey.creator != session.user.email) {
    throw new Error('Not authorized');
  }

  return {
    props: {
      survey: survey,
      _responses: responses,
      header: false,
    },
  };
};

export default Viewer;
