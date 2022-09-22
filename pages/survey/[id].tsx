import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, useCallback, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import {
  BsFillPersonBadgeFill,
  BsPersonCircle,
  BsUpload,
} from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import Question from '../../components/survey/question';
import { server } from '../../config';
import {
  ISurvey,
  ISurveyElement,
  ISurveyResponse,
  SurveyManager,
} from '../../utilities/manager/SurveyManager';
import { authOptions } from '../api/auth/[...nextauth]';

const Survey = ({
  survey,
  respondedInitial,
}: {
  survey: ISurvey;
  respondedInitial: boolean;
}) => {
  const { data: session } = useSession();
  const [surveyResponse, setSurveyResponse] = useState<ISurveyResponse>({
    surveyId: survey._id,
    date: '',
    answers: survey.elements.map((element) => {
      return {
        ...((element.type == 'multiple-choice' ||
          element.type == 'checkboxes') && { choices: [] }),
        ...(element.type == 'slider' && { number: null }),
        ...(element.type == 'free-response' && { text: null }),
      };
    }),
  } as ISurveyResponse);
  const [responded, setResponded] = useState(respondedInitial);
  1;

  const submitResponse = useCallback(async () => {
    if (!session?.user?.email) {
      return;
    }

    setResponded(true);

    await fetch(`${server}/api/response`, {
      method: 'POST',
      body: JSON.stringify({
        response: surveyResponse,
        respondent: session.user.email,
      }),
    });
  }, [surveyResponse, session?.user?.email]);

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
      setSurveyResponse(newResponse as ISurveyResponse);
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
        {survey.name || 'Untitled Survey'}
      </h1>
      <h2 className="text-md break-words text-gray-600">
        {survey.description || 'No description'}
      </h2>
      <h2 className="mt-2 text-sm font-bold text-exeter">* Required</h2>
      {session ? (
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-3">
              <BsPersonCircle className="text-2xl" />
              <h1>
                You are signed in as
                <br />
                <span className="font-bold">{session.user?.name}</span>
                <br />
                <Link href="/privacy">
                  <a className="text-sm text-exeter underline underline-offset-1">
                    Privacy statement
                  </a>
                </Link>
              </h1>
            </div>
            <button
              onClick={() => {
                signOut();
              }}
              className="flex flex-row items-center justify-center gap-2 self-center rounded-md bg-exeter py-2 px-3 text-white shadow-md"
            >
              <BiLogOut />
              <span>Sign out</span>
            </button>
          </div>
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
          {survey.published ? (
            responded ? (
              <button className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-neutral-400 py-2 px-2 text-white shadow-md">
                <IoClose />
                <span>You have already submitted this survey.</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  submitResponse();
                }}
                className="flex flex-row items-center justify-center gap-2 rounded-md bg-exeter py-2 px-2 text-white shadow-md"
              >
                <BsUpload />
                <span>Submit</span>
              </button>
            )
          ) : (
            <button className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-gray-400 py-2 px-2 text-white shadow-md">
              <AiOutlineStop />
              <span>Unpublished</span>
            </button>
          )}
          <h1>{JSON.stringify(surveyResponse, null, '\t')}</h1>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          <h1 className="text-center text-xl">
            Please sign in before taking this survey.
          </h1>
          <button
            onClick={() => {
              signIn('azure-ad');
            }}
            className="flex flex-row items-center justify-center gap-2 rounded-md bg-exeter py-2 px-2 text-white shadow-md"
          >
            <BsFillPersonBadgeFill />
            <span>Sign in with Exeter</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!context.query.id) {
    return {
      notFound: true,
    };
  }

  const survey: ISurvey = JSON.parse(
    JSON.stringify(await SurveyManager.getSurvey(context.query.id as string))
  );

  if (!survey) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      survey: survey,
      respondedInitial: session?.user?.email
        ? await SurveyManager.checkResponded(survey._id, session?.user?.email)
        : false,
      header: false,
    },
  };
};

export default Survey;
