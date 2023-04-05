import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { VictoryBar, VictoryChart, VictoryPie } from 'victory';
import { useChannel, useEvent } from '../../hooks/realtime';
import {
  getResponses,
  getSurvey,
  IPusherSurveyResponse,
  ISurvey,
  ISurveyResponse,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from '../api/auth/[...nextauth]';

const Viewer = ({
  survey,
  _responses,
}: {
  survey: ISurvey;
  _responses: IPusherSurveyResponse[];
}) => {
  const [responses, setResponses] = useState<IPusherSurveyResponse[]>(
    _responses.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
  );
  const channel = useChannel(survey._id);
  useEvent(
    channel,
    'new-response',
    (response: IPusherSurveyResponse | undefined) => {
      if (typeof response === 'undefined') return;

      setResponses([response, ...responses]);
    }
  );

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
                className="overflow-hidden rounded-lg bg-gray-100 p-8 shadow-md"
              >
                <h1 className="text-3xl">{element.title}</h1>
                <h1 className="text-xl text-gray-600">{element.description}</h1>
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
                  <div className="mt-8 flex h-full flex-col gap-10 overflow-y-scroll pb-20">
                    {responses.map((response) => (
                      <>
                        <p className="text-4xl" key={response.id}>
                          {response.answers[index].text}
                        </p>
                        <hr />
                      </>
                    ))}
                  </div>
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

  if (!session || !session.user || !session.user.email) {
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
    JSON.stringify(await getSurvey(context.query.id as string))
  );
  const responses = JSON.parse(
    JSON.stringify(await getResponses(context.query.id as string))
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
      _responses: responses.map((response: ISurveyResponse) => {
        return {
          ...response,
          answers: response.answers.map((answer) => {
            return {
              ...answer,
              ...(answer.file && {
                file: {
                  name: answer.file?.name,
                  fileType: answer.file?.fileType,
                },
              }),
            };
          }),
        };
      }),
      header: false,
    },
  };
};

export default Viewer;
