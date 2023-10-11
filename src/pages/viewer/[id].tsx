import {
  IPusherSurveyResponse,
  ISurvey,
  ISurveyResponse,
  getResponses,
  getSurvey,
} from '@/controllers/survey.controller';
import { useChannel, useEvent } from '@/hooks/realtime';
import ReactECharts from 'echarts-for-react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { VictoryBar, VictoryChart } from 'victory';
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

  const surveyLength = survey.elements.length;
  const [current, setCurrent] = useState<number>(0);
  const element = survey.elements[current];

  const increment = () => {
    if (current + 1 >= surveyLength) {
      setCurrent(current);
    } else {
      setCurrent(current + 1);
    }
  };

  const decrement = () => {
    if (current - 1 < 0) {
      setCurrent(current);
    } else {
      setCurrent(current - 1);
    }
  };

  const values: { [index: string]: number } = {};
  responses.forEach((response) => {
    let choice = response.answers[current].choices![0];

    if (!values[choice]) {
      values[choice] = 1;
    } else {
      values[choice] = values[choice] + 1;
    }
  });

  let data: [{ name: string; value: number }?] = [];
  Object.keys(values).forEach(function (key) {
    data.push({ name: key, value: values[key] });
  });

  return (
    <div className="mx-4 flex flex-col gap-12 self-stretch py-6 md:mx-32">
      <Head>
        <title>{survey.name + ' - Responses'}</title>
      </Head>
      <div className="">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <a
            onClick={() => decrement()}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Previous</span>
            <BsChevronLeft className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="#"
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            {(current + 1).toString()}/{surveyLength.toString()}
          </a>
          <a
            onClick={() => increment()}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          >
            <span className="sr-only">Next</span>
            <BsChevronRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </nav>
      </div>
      <div className="rounded-lg bg-gray-100 p-8 shadow-md">
        <h1 className="text-3xl">{element.title}</h1>
        <h1 className="text-xl text-gray-600">{element.description}</h1>
        {element.type === 'multiple-choice' && (
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'item',
              },
              legend: {
                orient: 'vertical',
                left: 'left',
              },
              series: [
                {
                  type: 'pie',
                  radius: '50%',
                  data: data,
                },
              ],
              animation: false,
            }}
          />
        )}
        {element.type === 'slider' && (
          <VictoryChart>
            <VictoryBar
              data={responses
                .map((response) => response.answers[current].number)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((number) => {
                  return {
                    x: number,
                    y: responses.reduce<number>((prev, response) => {
                      return response.answers[current].number === number
                        ? prev + 1
                        : prev;
                    }, 0),
                  };
                })}
            />
          </VictoryChart>
        )}
        {element.type === 'free-response' && (
          <div className="mt-8 flex h-full flex-col gap-10 overflow-y-scroll pb-20">
            {responses.map((response) => (
              <>
                <p className="text-4xl" key={response.id}>
                  {response.answers[current].text}
                </p>
                <hr />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
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
