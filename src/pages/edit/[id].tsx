import clsx from 'clsx';
import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { AiOutlineStop } from 'react-icons/ai';
import { BiLoaderAlt, BiPlus } from 'react-icons/bi';
import {
  BsChatLeftText,
  BsCheck2,
  BsClipboard,
  BsCloudUpload,
  BsFileEarmarkArrowUp,
  BsSliders,
  BsTextLeft,
  BsUiChecks,
  BsUiRadios,
  BsUpload,
} from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { v4 } from 'uuid';
import ElementEditorCard from '../../components/editor/elementEditorCard';
import useAutosave from '../../components/editor/useAutosave';
import Question from '../../components/survey/question';
import { server } from '../../config';
import { ISurvey, ISurveyElement } from '../../utilities/manager/SurveyManager';
import { authOptions } from '../api/auth/[...nextauth]';

const CopyLinkButton = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  return (
    <button
      onClick={async () => {
        if (copied) return;
        await navigator.clipboard.writeText(
          `${window.location.origin}/survey/${id}`
        );
        setCopied(true);
      }}
      className={clsx(
        'flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md',
        {
          'bg-green-500': copied,
        }
      )}
    >
      <BsClipboard />
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
};

const reorder = (
  list: Array<ISurveyElement>,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Edit = ({ id }: { id: string }) => {
  const [saving, setSaving] = useState(false);
  const [editedSurvey, saveEditedSurvey] = useAutosave(setSaving, id);

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
        className="flex flex-row items-center rounded-md border border-gray-200 bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
      >
        {icon}
        <span className="mx-2">{name}</span>
      </button>
    );
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      editedSurvey!.elements,
      result.source.index,
      result.destination.index
    );

    saveEditedSurvey({ ...editedSurvey, elements: items } as ISurvey);
  };

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex w-full flex-row overflow-hidden">
      <Head>
        <title>{editedSurvey?.name || 'Untitled Survey'}</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`h-screen w-2/5 overflow-x-hidden overflow-y-scroll bg-gray-100 p-8 ${
          editedSurvey?.published ?? true ? 'pointer-events-none' : ''
        }`}
      >
        {/* Back button and title and description editor */}
        <Link href="/manager" className="pointer-events-auto text-gray-400">
          {'← Back to Manager'}
        </Link>
        <span className="w-full rounded-sm text-3xl font-bold leading-none">
          {editedSurvey ? (
            <input
              disabled={editedSurvey?.published ?? true}
              role="textbox"
              className="mt-8 w-full cursor-text rounded-sm bg-transparent text-3xl font-bold leading-normal text-gray-800 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
              contentEditable
              placeholder="Untitled Survey"
              type="text"
              defaultValue={editedSurvey?.name ?? ''}
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
          ) : (
            <Skeleton height={45} className="mt-8" />
          )}
        </span>
        <span>
          {editedSurvey ? (
            <input
              disabled={editedSurvey?.published ?? true}
              role="textbox"
              className="my-4 w-full cursor-text rounded-sm bg-transparent text-xl text-gray-600 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
              contentEditable
              placeholder="No description"
              type="text"
              defaultValue={editedSurvey?.description ?? ''}
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
          ) : (
            <Skeleton height={28} className="my-4" />
          )}
        </span>
        <div className="flex flex-row gap-2">
          <input
            type="checkbox"
            disabled={editedSurvey?.published ?? true}
            defaultChecked={editedSurvey?.identifiable ?? false}
            id={`identifiable-${id}`}
            onChange={(e) => {
              const newSurvey = { ...editedSurvey };
              newSurvey.identifiable = e.currentTarget.checked;
              saveEditedSurvey(newSurvey as ISurvey);
            }}
          />
          <label htmlFor={`identifiable-${id}`}>Identify respondents?</label>
        </div>
        <hr className="my-5" />
        {/* Create new element buttons */}
        <p className="mb-2 flex flex-row items-center gap-1 font-monospace text-gray-500">
          <BiPlus /> CREATE
        </p>
        <div className="flex flex-row flex-wrap gap-2">
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
          <CreateElementButton
            name="File Upload"
            type="file-upload"
            icon={<BsFileEarmarkArrowUp />}
          />
        </div>
        <hr className="my-5" />
        {/* Elements editor */}
        <div className="mt-8 flex flex-col items-stretch justify-start">
          {editedSurvey ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, _) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {editedSurvey.elements.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, _) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ElementEditorCard
                              surveyElement={item}
                              editedSurvey={editedSurvey}
                              saveEditedSurvey={saveEditedSurvey}
                              published={editedSurvey.published}
                              key={item.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <>
              <div className="h-40 w-full rounded-lg leading-none">
                <Skeleton className="m-0 h-full w-full p-0" />
              </div>
              <div className="mt-8 h-28 w-full rounded-lg leading-none">
                <Skeleton className="m-0 h-full w-full p-0" />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="relative flex h-screen w-full flex-row items-center justify-center bg-gray-50">
        {editedSurvey ? (
          <motion.div
            initial={{ scale: 0.95, backgroundColor: 'rgb(163 163 163)' }}
            animate={{ scale: 1, backgroundColor: 'rgb(255 255 255)' }}
            transition={{
              duration: 0.5,
              ease: 'circOut',
            }}
            className="flex aspect-[400/780] h-[95%] flex-col gap-8 overflow-x-hidden overflow-y-scroll p-6 shadow-2xl"
          >
            {/* Survey preview */}
            <div>
              <h1 className="break-words text-2xl font-bold text-gray-800">
                {editedSurvey?.name || 'Untitled Survey'}
              </h1>
              <h2 className="text-md break-words text-gray-600">
                {editedSurvey?.description || 'No description'}
              </h2>
              <Link
                href="/privacy"
                className="text-sm text-exeter underline underline-offset-1"
              >
                Privacy notice
              </Link>
              <h2 className="mt-2 text-sm font-bold text-exeter">* Required</h2>
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
        ) : (
          <div className="flex aspect-[400/780] h-[95%] scale-95 flex-col items-center justify-center gap-8 overflow-x-hidden overflow-y-scroll bg-neutral-300 p-6 shadow-2xl">
            <BiLoaderAlt className="animate-spin text-5xl text-white" />
          </div>
        )}
        {/* Controls overlay */}
        <div className="pointer-events-none absolute flex h-full w-full flex-row items-start justify-end py-1 px-3">
          <div className="pointer-events-auto flex flex-row gap-4 rounded-lg bg-gray-50/80 p-3">
            {editedSurvey ? (
              <>
                {saving && !editedSurvey?.published ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BiLoaderAlt className="animate-spin" />
                    <span>Saving...</span>
                  </motion.div>
                ) : !editedSurvey?.published ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BsCheck2 className="mt-0.5" />
                    <span>Saved</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-none flex select-none flex-row items-center justify-end gap-1 text-gray-400"
                  >
                    <BsCloudUpload className="mt-0.5" />
                    <span>Published</span>
                  </motion.div>
                )}
                {editedSurvey?.published ? (
                  <div className="flex flex-row gap-2">
                    <CopyLinkButton id={editedSurvey._id} />
                    <Link href={`/viewer/${editedSurvey._id}`} legacyBehavior>
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
                        await fetch(`${server}/api/publish?id=${id}`, {
                          method: 'POST',
                        });
                      }
                    }}
                    disabled={saving}
                    className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <BsCloudUpload />
                    <span>Publish</span>
                  </button>
                )}
              </>
            ) : (
              <div className="h-10 w-44 rounded-md bg-neutral-100 leading-none">
                <Skeleton className="h-full w-full" />
              </div>
            )}
          </div>
        </div>
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
