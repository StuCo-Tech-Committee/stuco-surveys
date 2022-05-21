import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, useCallback, useState } from 'react';
import { BsUpload } from 'react-icons/bs';
import Question from '../../components/survey/question';
import { server } from '../../config';
import {
  ISurvey,
  ISurveyElement,
  ISurveyResponse,
} from '../../utilities/manager/SurveyManager';

const Survey = ({ survey }: { survey: ISurvey }) => {
  const [surveyResponse, setSurveyResponse] = useState<ISurveyResponse>({
    answers: survey.elements.map((element) => {
      return {
        ...((element.type == 'multiple-choice' ||
          element.type == 'checkboxes') && { choices: [] }),
        ...(element.type == 'slider' && { number: null }),
        ...(element.type == 'free-response' && { text: null }),
      };
    }),
  });

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      element: ISurveyElement,
      index: number
    ) => {
      const newResponse = { ...surveyResponse };
      newResponse.answers[index] = {
        ...(element.type == 'multiple-choice' && {
          choices: [
            e.currentTarget.checked
              ? e.currentTarget.value
              : newResponse.answers![index].choices![0],
          ],
        }),
        ...(element.type == 'checkboxes' && {
          choices: e.currentTarget.checked
            ? [...newResponse.answers![index].choices!, e.currentTarget.value]
            : [...newResponse.answers![index].choices!].filter((_, idx) => {
                return (
                  newResponse.answers![index].choices!.indexOf(
                    e.currentTarget.value
                  ) !== idx
                );
              }),
        }),
        ...(element.type == 'slider' && {
          number: e.currentTarget.valueAsNumber,
        }),
        ...(element.type == 'free-response' && { text: e.currentTarget.value }),
      };
      setSurveyResponse(newResponse);
    },
    [surveyResponse]
  );

  return (
    <div className="min-w-screen mx-auto max-w-lg py-8 px-4">
      <Head>
        <title>{survey.name}</title>
        <meta name="description" content={survey.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="break-words text-3xl font-bold text-gray-800">
        {survey.name}
      </h1>
      <h2 className="text-md break-words text-gray-600">
        {survey.description}
      </h2>
      <Link href="/privacy">
        <a className="text-sm text-exeter underline underline-offset-1">
          Privacy notice
        </a>
      </Link>
      <h2 className="mt-2 text-sm font-bold text-exeter">* Required</h2>
      <div className="mt-8 flex flex-col gap-6">
        {survey.elements.map((element, index) => {
          return (
            <Question
              key={element.id}
              questionIndex={index}
              element={element}
              handleChange={handleChange}
            />
          );
        })}
        <button className="flex flex-row items-center justify-center gap-2 rounded-md bg-exeter py-2 px-2 text-white shadow-md">
          <BsUpload />
          <span>Submit</span>
        </button>
        <h1>{JSON.stringify(surveyResponse, null, '\t')}</h1>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const survey: ISurvey = await (
    await fetch(`${server}/api/survey?id=${context.query.id}`)
  ).json();

  return {
    props: {
      survey: survey,
      header: false,
    },
  };
};

export default Survey;
