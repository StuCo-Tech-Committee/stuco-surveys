import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  BsChatLeftText,
  BsCheck2,
  BsClipboard,
  BsCloudUpload,
  BsSliders,
  BsTextLeft,
  BsUiChecks,
  BsUiRadios,
  BsUpload,
} from 'react-icons/bs';
import { v4 } from 'uuid';
import authorized from '../../authorized';
import ElementEditorCard from '../../components/editor/elementEditorCard';
import useAutosave from '../../components/editor/useAutosave';
import Question from '../../components/survey/question';
import { server } from '../../config';
import { ISurvey } from '../../utilities/manager/SurveyManager';
import { authOptions } from '../api/auth/[...nextauth]';

const Edit = ({ id }: { id: string }) => {
  const [saving, setSaving] = useState(false);
  const [editedSurvey, saveEditedSurvey] = useAutosave(setSaving, undefined);

  useEffect(() => {
    (async () => {
      const survey: ISurvey = await (
        await fetch(`${server}/api/survey?id=${id}`)
      ).json();

      saveEditedSurvey(survey);
    })();
  }, [id, saveEditedSurvey]);

  const createSurveyElement = (type: string) => {
    if (!editedSurvey) return;

    saveEditedSurvey({
      ...editedSurvey,
      elements: [
        ...editedSurvey.elements,
        {
          id: v4(),
          type: type,
          title: '',
          description: '',
          required: true,
          ...((type == 'multiple-choice' || type == 'checkboxes') && {
            choices: [],
          }),
          ...(type == 'slider' && { range: [0, 10], step: undefined }),
        },
      ],
    } as ISurvey);
  };

  const CreateElementButton = ({
    name,
    type,
    icon,
  }: {
    name: string;
    type: string;
    icon: ReactNode;
  }) => {
    return (
      <button
        disabled={editedSurvey?.published ?? true}
        onClick={() => {
          createSurveyElement(type);
        }}
        className="my-2 flex flex-row items-center rounded-md bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
      >
        {icon}
        <span className="mx-2">{name}</span>
      </button>
    );
  };

  return (
    <motion.div className="flex w-full flex-row overflow-hidden">
      <Head>
        <title>{editedSurvey?.name || 'Untitled Survey'}</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {editedSurvey && editedSurvey.hasOwnProperty('_id') ? (
        <>
          <div
            className={`h-screen w-2/5 overflow-x-hidden overflow-y-scroll bg-gray-100 p-8 ${
              editedSurvey.published ? 'pointer-events-none' : ''
            }`}
          >
            {/* Back button and title and description editor */}
            <Link href="/manager">
              <a className="pointer-events-auto text-gray-400">
                {'← Back to Manager'}
              </a>
            </Link>
            <input
              disabled={editedSurvey.published}
              role="textbox"
              className="mt-8 w-full cursor-text rounded-sm bg-transparent text-3xl font-bold text-gray-800 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
              contentEditable
              placeholder="Untitled Survey"
              type="text"
              defaultValue={editedSurvey.name}
              onKeyDown={(e) => {
                if (e.code == 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              onChange={(e) => {
                saveEditedSurvey({
                  ...editedSurvey,
                  name: e.currentTarget.value,
                } as ISurvey);
              }}
            ></input>
            <input
              disabled={editedSurvey.published}
              role="textbox"
              className="my-4 w-full cursor-text rounded-sm bg-transparent text-xl text-gray-600 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
              contentEditable
              placeholder="No description"
              type="text"
              defaultValue={editedSurvey.description}
              onKeyDown={(e) => {
                if (e.code == 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              onChange={(e) => {
                saveEditedSurvey({
                  ...editedSurvey,
                  description: e.currentTarget.value,
                } as ISurvey);
              }}
            ></input>
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                disabled={editedSurvey.published}
                defaultChecked={editedSurvey.identifiable}
                id={`identifiable-${id}`}
                onChange={(e) => {
                  const newSurvey = { ...editedSurvey };
                  newSurvey.identifiable = e.currentTarget.checked;
                  saveEditedSurvey(newSurvey as ISurvey);
                }}
              />
              <label htmlFor={`identifiable-${id}`}>
                Identify respondents?
              </label>
            </div>
            <br></br>
            {/* Create new element buttons */}
            <CreateElementButton
              name="Multiple Choice"
              type="multiple-choice"
              icon={<BsUiRadios />}
            />
            <CreateElementButton
              name="Checkboxes"
              type="checkboxes"
              icon={<BsUiChecks />}
            />
            <CreateElementButton
              name="Slider"
              type="slider"
              icon={<BsSliders />}
            />
            <CreateElementButton
              name="Free Response"
              type="free-response"
              icon={<BsTextLeft />}
            />
            {/* Elements editor */}
            <div className="mt-8 flex flex-col items-start justify-start">
              {editedSurvey.elements.map((surveyElement) => {
                return (
                  <ElementEditorCard
                    surveyElement={surveyElement}
                    editedSurvey={editedSurvey}
                    saveEditedSurvey={saveEditedSurvey}
                    published={editedSurvey.published}
                    key={surveyElement.id}
                  />
                );
              })}
            </div>
          </div>
          <div className="relative flex h-screen w-full flex-row items-center justify-center bg-gray-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, filter: 'blur(2px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="flex aspect-[400/780] h-[95%] flex-col gap-8 overflow-x-hidden overflow-y-scroll bg-white p-6 shadow-2xl"
            >
              {/* Survey preview */}
              <div>
                <h1 className="break-words text-2xl font-bold text-gray-800">
                  {editedSurvey.name || 'Untitled Survey'}
                </h1>
                <h2 className="text-md break-words text-gray-600">
                  {editedSurvey.description || 'No description'}
                </h2>
                <Link href="/privacy">
                  <a className="text-sm text-exeter underline underline-offset-1">
                    Privacy notice
                  </a>
                </Link>
                <h2 className="mt-2 text-sm font-bold text-exeter">
                  * Required
                </h2>
              </div>
              {editedSurvey.elements.map((element, index) => {
                return (
                  <Question
                    key={element.id}
                    questionIndex={index}
                    element={element}
                  />
                );
              })}
              {editedSurvey.published ? (
                <button className="flex flex-row items-center justify-center gap-2 rounded-md bg-exeter py-2 px-2 text-white shadow-md">
                  <BsUpload />
                  <span>Submit</span>
                </button>
              ) : (
                <button className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-gray-400 py-2 px-2 text-white shadow-md">
                  <AiOutlineStop />
                  <span>Unpublished</span>
                </button>
              )}
            </motion.div>
            {/* Controls overlay */}
            <div className="pointer-events-none absolute flex h-full w-full flex-row items-start justify-end py-4 px-6">
              <div className="pointer-events-auto flex flex-row gap-4">
                {saving && !editedSurvey.published ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BiLoaderAlt className="animate-spin" />
                    <span>Saving...</span>
                  </motion.div>
                ) : !editedSurvey.published ? (
                  <motion.main
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BsCheck2 className="mt-0.5" />
                    <span>Saved</span>
                  </motion.main>
                ) : (
                  <motion.main
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BsCloudUpload className="mt-0.5" />
                    <span>Published</span>
                  </motion.main>
                )}
                {editedSurvey.published ? (
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={async () => {
                        navigator.clipboard.writeText(
                          `${server}/survey/${editedSurvey._id}`
                        );
                      }}
                      className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md"
                    >
                      <BsClipboard />
                      <span>Copy Link</span>
                    </button>
                    <Link href={`/viewer/${editedSurvey._id}`}>
                      <button className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md">
                        <BsChatLeftText />
                        <span>Responses</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          `Publishing this survey will disable editing. This action is permanent!\n\nDo you wish to continue?`
                        )
                      ) {
                        saveEditedSurvey({
                          ...editedSurvey,
                          published: true,
                        } as ISurvey);
                        await fetch(
                          `${server}/api/publish?id=${editedSurvey._id}`,
                          {
                            method: 'POST',
                          }
                        );
                      }
                    }}
                    disabled={saving}
                    className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <BsCloudUpload />
                    <span>Publish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center">
          <h1 className="flex flex-row items-center gap-2 text-neutral-800">
            <BiLoaderAlt className="animate-spin" />
            <span>Loading...</span>
          </h1>
        </div>
      )}
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
      id: context.query.id,
      header: false,
    },
  };
};

export default Edit;
