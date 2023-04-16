import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { AiOutlineStop, AiOutlineWarning } from 'react-icons/ai';
import { BiLoaderAlt, BiLogOut } from 'react-icons/bi';
import {
  BsFillCheckCircleFill,
  BsFillPersonBadgeFill,
  BsPersonCircle,
  BsUpload,
} from 'react-icons/bs';
import Question from '../../components/survey/question';
import {
  ISurvey,
  ISurveyElement,
  ISurveyResponse,
  checkResponded,
  getSurvey,
} from '../../controllers/survey.controller';
import { authOptions } from '../api/auth/[...nextauth]';

const Survey = ({
  survey,
  responded,
}: {
  survey: ISurvey;
  responded: boolean;
}) => {
  const { data: session, status } = useSession();
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
  const [responseValid, setResponseValid] = useState<boolean>(false);
  const [submissionState, setSubmissionState] = useState<
    'idle' | 'submitting' | 'submitted'
  >('idle');

  useEffect(() => {
    // Go through each element in the survey and check if the corresponding response has been answered.
    // If all elements have been answered, set the response as valid.
    setResponseValid(
      survey.elements.every((element, index) => {
        if (!element.required) return true;

        if (element.type == 'multiple-choice' || element.type == 'checkboxes') {
          return surveyResponse.answers[index].choices!.length > 0;
        } else if (element.type == 'slider') {
          return surveyResponse.answers[index].number != null;
        } else if (element.type == 'free-response') {
          return surveyResponse.answers[index].text != null;
        } else if (element.type == 'file-upload') {
          return (
            surveyResponse.answers[index].file &&
            Buffer.byteLength(surveyResponse.answers[index].file!.data) <
              16777216
          );
        } else {
          return false;
        }
      })
    );
  }, [surveyResponse, survey.elements]);

  const submitResponse = useCallback(async () => {
    if (!session?.user?.email) {
      return;
    }

    setSubmissionState('submitting');

    await fetch(`/api/response`, {
      method: 'POST',
      body: JSON.stringify(
        surveyResponse
        // respondent: session.user.email,
      ),
    });

    setSubmissionState('submitted');
  }, [surveyResponse, session?.user?.email]);

  // Function to convert ArrayBuffer to Buffer
  const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  };

  const handleChange = useCallback(
    async (
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
        ...(element.type == 'file-upload' &&
          e.currentTarget.files![0] && {
            file: {
              name: e.currentTarget.files![0].name,
              fileType: e.currentTarget.files![0].type,
              data: arrayBufferToBuffer(
                await e.currentTarget.files![0].arrayBuffer()
              ),
            },
          }),
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
      {
        {
          authenticated: session && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ease: 'backOut',
                duration: 0.4,
              }}
              className="mt-8 flex origin-top flex-col gap-6"
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-3">
                  <BsPersonCircle className="text-2xl" />
                  <h1>
                    You are signed in as
                    <br />
                    <span className="font-bold">{session.user?.name}</span>
                    <br />
                    <Link
                      href="/privacy"
                      className="text-sm text-exeter underline underline-offset-1"
                    >
                      Privacy statement
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
              {survey.identifiable && (
                <div className="flex flex-row items-center justify-center gap-2 rounded-md border border-red-200 bg-red-500/10 p-3">
                  <AiOutlineWarning />
                  <span>
                    Your identity is tied to your response for this survey!
                  </span>
                </div>
              )}
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
                  <button
                    disabled
                    className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-neutral-400 py-2 px-2 text-white shadow-md"
                  >
                    <AiOutlineStop />
                    <span>You have already submitted this survey.</span>
                  </button>
                ) : (
                  {
                    idle: responseValid ? (
                      <button
                        onClick={() => {
                          submitResponse();
                        }}
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-exeter py-2 px-2 text-white shadow-md"
                      >
                        <BsUpload />
                        <span>Submit</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-neutral-400 py-2 px-2 text-white shadow-md"
                      >
                        <AiOutlineStop />
                        <span>Please answer all required questions.</span>
                      </button>
                    ),
                    submitting: (
                      <button
                        disabled
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-neutral-500 py-2 px-2 text-white shadow-md"
                      >
                        <BiLoaderAlt className="animate-spin" />
                        <span>Submitting...</span>
                      </button>
                    ),
                    submitted: (
                      <button
                        disabled
                        className="flex flex-row items-center justify-center gap-2 rounded-md bg-green-500 py-2 px-2 text-white shadow-md"
                      >
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ ease: 'backOut', duration: 0.4 }}
                        >
                          <BsFillCheckCircleFill className="text-lg" />
                        </motion.div>
                        <span>Submitted!</span>
                      </button>
                    ),
                  }[submissionState]
                )
              ) : (
                <button
                  disabled
                  className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-gray-400 py-2 px-2 text-white shadow-md"
                >
                  <AiOutlineStop />
                  <span>Unpublished</span>
                </button>
              )}
            </motion.div>
          ),
          unauthenticated: (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ease: 'backOut',
                duration: 0.4,
              }}
              className="mt-8 flex origin-top flex-col gap-6"
            >
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
            </motion.div>
          ),
          loading: (
            <div className="mt-8 flex flex-row items-center justify-center gap-2">
              <BiLoaderAlt className="animate-spin text-lg" />
              <h1 className="text-center text-xl">Loading...</h1>
            </div>
          ),
        }[status]
      }
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
    JSON.stringify(await getSurvey(context.query.id as string))
  );

  if (!survey) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      survey: survey,
      responded: session?.user?.email
        ? await checkResponded(survey._id, session?.user?.email)
        : false,
      header: false,
    },
  };
};

export default Survey;
