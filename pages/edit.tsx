import {
  BsUiRadios,
  BsUiChecks,
  BsSliders,
  BsTextLeft,
  BsSave,
  BsCloudUpload,
} from 'react-icons/bs';
import { BiLoaderAlt } from 'react-icons/bi';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { ISurvey } from '../utilities/manager/SurveyManager';
import ElementEditorCard from '../components/editor/elementEditorCard';
import { v4 } from 'uuid';

const Edit = ({ survey }: { survey: ISurvey }) => {
  const [editedSurvey, setEditedSurvey] = useState(survey);
  const [saving, setSaving] = useState(false);

  const saveSurvey = async () => {
    if (saving) return;

    setSaving(true);
    await fetch('http://localhost:3000/api/updateSurvey', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editedSurvey),
    });
    setTimeout(() => {
      setSaving(false);
    }, 3000);
  };

  // CTRL + S to save
  if (typeof window != 'undefined') {
    document.onkeydown = (e) => {
      if (e.ctrlKey && e.code == 'KeyS') {
        e.preventDefault();
        saveSurvey();
      }
    };
  }

  const createSurveyElement = (type: string) => {
    setEditedSurvey({
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
          ...(type == 'slider' && { range: [], step: undefined }),
        },
      ],
    } as ISurvey);
  };

  return (
    <div className="flex w-full flex-row">
      <Head>
        <title>StuCo Surveys</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-2/5 overflow-x-hidden overflow-y-scroll bg-gray-100 p-8">
        {/* Back button and title and description editor */}
        <Link href="/manager">
          <a className="text-gray-400">{'← Back to Manager'}</a>
        </Link>
        <input
          role="textbox"
          className="mt-8 w-full cursor-text rounded-sm bg-transparent text-3xl font-bold text-gray-800 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
          contentEditable
          placeholder="Untitled Survey"
          type="text"
          defaultValue={survey.name}
          onKeyDown={(e) => {
            if (e.code == 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            setEditedSurvey({
              ...editedSurvey,
              name: e.currentTarget.value,
            } as ISurvey);
          }}
        ></input>
        <input
          role="textbox"
          className="my-4 w-full cursor-text rounded-sm bg-transparent text-xl text-gray-600 outline outline-0 outline-offset-4 outline-gray-300 hover:outline-2 focus:outline-2"
          contentEditable
          placeholder="No description"
          type="text"
          defaultValue={survey.description}
          onKeyDown={(e) => {
            if (e.code == 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            setEditedSurvey({
              ...editedSurvey,
              description: e.currentTarget.value,
            } as ISurvey);
          }}
        ></input>
        <br></br>
        {/* Create new element buttons */}
        <button
          onClick={() => {
            createSurveyElement('multiple-choice');
          }}
          className="my-2 flex flex-row items-center rounded-md bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
        >
          <BsUiRadios />
          <span className="mx-2">Multiple Choice</span>
        </button>
        <button
          onClick={() => {
            createSurveyElement('checkboxes');
          }}
          className="my-2 flex flex-row items-center rounded-md bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
        >
          <BsUiChecks />
          <span className="mx-2">Checkboxes</span>
        </button>
        <button
          onClick={() => {
            createSurveyElement('slider');
          }}
          className="my-2 flex flex-row items-center rounded-md bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
        >
          <BsSliders />
          <span className="mx-2">Slider</span>
        </button>
        <button
          onClick={() => {
            createSurveyElement('free-response');
          }}
          className="my-2 flex flex-row items-center rounded-md bg-white p-2 font-semibold text-gray-800 transition-all hover:shadow-md"
        >
          <BsTextLeft />
          <span className="mx-2">Free Response</span>
        </button>
        {/* Elements editor */}
        <div className="mt-8 flex flex-col items-start justify-start">
          {editedSurvey.elements.map((surveyElement) => {
            return (
              <ElementEditorCard
                surveyElement={surveyElement}
                editedSurvey={editedSurvey}
                setEditedSurvey={setEditedSurvey}
                key={surveyElement.id}
              />
            );
          })}
        </div>
      </div>
      <div className="relative flex h-screen w-full flex-row items-center justify-center bg-gray-50">
        <div className="aspect-[400/780] h-[95%] overflow-x-hidden overflow-y-scroll bg-white p-6 shadow-2xl">
          {/* Survey preview */}
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
        </div>
        {/* Controls overlay */}
        <div className="pointer-events-none absolute flex h-full w-full flex-row items-start justify-end py-4 px-6">
          <div className="pointer-events-auto flex flex-row gap-2">
            {!saving ? (
              <button
                onClick={() => saveSurvey()}
                className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md"
              >
                <BsSave />
                <span>Save</span>
              </button>
            ) : (
              <button
                disabled={true}
                className="flex cursor-not-allowed flex-row items-center justify-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-white"
              >
                <BiLoaderAlt className="animate-spin" />
                <span>Saving...</span>
              </button>
            )}
            <button
              onClick={() => {
                alert(
                  'Publishing this survey will disable editing and will request all of campus to complete it.\n\nAre you sure you wish to proceed?'
                );
              }}
              className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white transition-all hover:shadow-md"
            >
              <BsCloudUpload />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const survey: ISurvey = await (
    await fetch(`http://localhost:3000/api/getSurvey?id=${context.query.id}`)
  ).json();

  return {
    props: {
      survey: survey,
    },
  };
};

export default Edit;
