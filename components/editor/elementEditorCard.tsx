import { Dispatch, SetStateAction } from 'react';
import { ISurvey, ISurveyElement } from '../../utilities/manager/SurveyManager';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BsCircle, BsTrash } from 'react-icons/bs';
import { TiDeleteOutline } from 'react-icons/ti';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';

const ElementEditorCard = ({
  surveyElement,
  editedSurvey,
  setEditedSurvey,
}: {
  surveyElement: ISurveyElement;
  editedSurvey: ISurvey;
  setEditedSurvey: Dispatch<SetStateAction<ISurvey>>;
}) => {
  const Editor = () => {
    switch (surveyElement.type) {
      case 'multiple-choice':
        return (
          <div className="flex flex-col items-start justify-start">
            {surveyElement.choices!.map((choice, index) => {
              return (
                <div
                  key={index}
                  className="flex w-full flex-row items-center justify-start"
                >
                  <BsCircle className="mt-0.5" />
                  <input
                    className="my-1 ml-2 mr-2 w-full bg-transparent"
                    placeholder="Choice"
                    defaultValue={choice}
                    onChange={(e) => {
                      editedSurvey.elements.find(
                        (element) => element.id == surveyElement.id
                      )!.choices![index] = e.currentTarget.value;
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      const newSurvey = { ...editedSurvey };
                      editedSurvey.elements
                        .find((element) => element.id == surveyElement.id)
                        ?.choices?.splice(index, 1);
                      setEditedSurvey(newSurvey as ISurvey);
                    }}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => {
                const newSurvey = { ...editedSurvey };
                newSurvey.elements
                  .find((element) => element.id == surveyElement.id)
                  ?.choices?.push('');
                setEditedSurvey(newSurvey as ISurvey);
              }}
              className="mt-1 flex flex-row items-center rounded-md py-1 transition-all hover:bg-gray-100"
            >
              <AiFillPlusCircle />
              <span className="ml-2">New choice</span>
            </button>
          </div>
        );
      case 'checkboxes':
        return (
          <div className="flex flex-col items-start justify-start">
            {surveyElement.choices!.map((choice, index) => {
              return (
                <div
                  key={index}
                  className="flex w-full flex-row items-center justify-start"
                >
                  <MdCheckBoxOutlineBlank className="mt-0.5" />
                  <input
                    className="my-1 ml-2 mr-2 w-full bg-transparent"
                    placeholder="Choice"
                    defaultValue={choice}
                    onChange={(e) => {
                      editedSurvey.elements.find(
                        (element) => element.id == surveyElement.id
                      )!.choices![index] = e.currentTarget.value;
                    }}
                  ></input>
                  <button
                    onClick={() => {
                      const newSurvey = { ...editedSurvey };
                      editedSurvey.elements
                        .find((element) => element.id == surveyElement.id)
                        ?.choices?.splice(index, 1);
                      setEditedSurvey(newSurvey as ISurvey);
                    }}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => {
                const newSurvey = { ...editedSurvey };
                newSurvey.elements
                  .find((element) => element.id == surveyElement.id)
                  ?.choices?.push('');
                setEditedSurvey(newSurvey as ISurvey);
              }}
              className="mt-1 flex flex-row items-center rounded-md py-1 transition-all hover:bg-gray-100"
            >
              <AiFillPlusCircle />
              <span className="ml-2">New choice</span>
            </button>
          </div>
        );
      case 'slider':
        return (
          <div className="flex flex-col gap-1">
            <div className="mt-2 flex flex-row items-center justify-center">
              <input
                className="m-0 w-9 bg-transparent text-center text-gray-600"
                type="number"
                defaultValue={surveyElement.range?.[0]}
                onChange={(e) => {
                  editedSurvey.elements.find(
                    (element) => element.id == surveyElement.id
                  )!.range![0] = parseFloat(e.currentTarget.value);
                }}
                placeholder="Min"
              ></input>
              <div className="mx-2 flex h-1 w-full flex-row items-center justify-center rounded-2xl bg-gray-500">
                <div className="aspect-square h-3 rounded-2xl bg-gray-400"></div>
              </div>
              <input
                className="m-0 w-9 bg-transparent text-center text-gray-600"
                type="number"
                defaultValue={surveyElement.range?.[1]}
                onChange={(e) => {
                  editedSurvey.elements.find(
                    (element) => element.id == surveyElement.id
                  )!.range![1] = parseFloat(e.currentTarget.value);
                }}
                placeholder="Max"
              ></input>
            </div>
            <div className="flex flex-row gap-2">
              <span className="text-gray-500">Step:</span>
              <input
                className="w-10 bg-transparent text-left text-gray-600"
                defaultValue={surveyElement.step}
                onChange={(e) => {
                  editedSurvey.elements.find(
                    (element) => element.id == surveyElement.id
                  )!.step =
                    parseFloat(e.currentTarget.value) == 0
                      ? undefined
                      : parseFloat(e.currentTarget.value);
                }}
                placeholder="None"
              ></input>
            </div>
          </div>
        );
      case 'free-response':
        return (
          <div>
            <h1>I am free response</h1>
          </div>
        );
      default:
        return (
          <div>
            <h1>{`You shouldn't see this!`}</h1>
          </div>
        );
    }
  };

  return (
    <div className="mb-4 w-full rounded-md bg-gray-50 p-4">
      <div className="flex flex-row">
        <input
          className="mr-4 w-full cursor-text rounded-sm bg-transparent text-lg font-bold text-gray-800 outline outline-0 outline-offset-2 outline-gray-300 before:text-gray-400 empty:before:content-['Untitled_question'] hover:outline-2 focus:outline-2"
          defaultValue={surveyElement.title}
          placeholder="Untitled Question"
          onKeyDown={(e) => {
            if (e.code == 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onChange={(e) => {
            const newSurvey = { ...editedSurvey };
            newSurvey.elements.find(
              (element) => element.id == surveyElement.id
            )!.title = e.currentTarget.value;
            setEditedSurvey(newSurvey as ISurvey);
          }}
          contentEditable
        ></input>
        <button
          onClick={() => {
            const newSurvey = { ...editedSurvey };
            const index = newSurvey.elements.findIndex(
              (element) => element.id == surveyElement.id
            )!;
            newSurvey.elements.splice(index, 1);
            setEditedSurvey(newSurvey as ISurvey);
          }}
        >
          <BsTrash />
        </button>
      </div>
      <input
        className="my-2 w-full cursor-text rounded-sm bg-transparent text-gray-600 outline outline-0 outline-offset-2 outline-gray-300 before:text-gray-400 empty:before:content-['No_description'] hover:outline-2 focus:outline-2"
        defaultValue={surveyElement.description}
        placeholder="No description"
        onKeyDown={(e) => {
          if (e.code == 'Enter') {
            e.currentTarget.blur();
          }
        }}
        onChange={(e) => {
          const newSurvey = { ...editedSurvey };
          newSurvey.elements.find(
            (element) => element.id == surveyElement.id
          )!.description = e.currentTarget.value;
          setEditedSurvey(newSurvey as ISurvey);
        }}
        contentEditable
      ></input>
      <Editor />
    </div>
  );
};

export default ElementEditorCard;
