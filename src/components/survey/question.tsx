import { ChangeEvent, useState } from 'react';
import { BsFileEarmarkArrowUp } from 'react-icons/bs';
import { ISurveyElement } from '../../utilities/manager/SurveyManager';
import humanFileSize from './humanFileSize';

const AnswerPanel = ({
  element,
  handleChange,
  questionIndex,
}: {
  questionIndex: number;
  element: ISurveyElement;
  handleChange?: (
    e: ChangeEvent<HTMLInputElement>,
    element: ISurveyElement,
    index: number
  ) => void;
}) => {
  const [number, setNumber] = useState<number>();
  const [file, setFile] = useState<File>();

  switch (element.type) {
    case 'multiple-choice':
      return (
        <div className="mt-2 flex flex-col gap-1">
          {element.choices!.map((choice, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-start gap-1.5"
              >
                <input
                  type="radio"
                  name={element.id}
                  className="mt-0.5"
                  id={choice}
                  value={choice}
                  onChange={(e) =>
                    handleChange && handleChange(e, element, questionIndex)
                  }
                ></input>
                <label
                  htmlFor={choice}
                  className="empty:text-gray-400 empty:before:content-['Choice']"
                >
                  {choice}
                </label>
              </div>
            );
          })}
        </div>
      );
    case 'checkboxes':
      return (
        <div className="mt-2 flex flex-col gap-1">
          {element.choices!.map((choice, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-start gap-1.5"
              >
                <input
                  type="checkbox"
                  name={element.id}
                  className="mt-0.5"
                  id={choice}
                  value={choice}
                  onChange={(e) =>
                    handleChange && handleChange(e, element, questionIndex)
                  }
                ></input>
                <label
                  htmlFor={choice}
                  className="empty:text-gray-400 empty:before:content-['Choice']"
                >
                  {choice}
                </label>
              </div>
            );
          })}
        </div>
      );
    case 'slider':
      return (
        <div className="mt-4">
          <div className="flex flex-row justify-center gap-4">
            <span>{(element.range![0] ?? 0).toString()}</span>
            <input
              type="range"
              className="w-full"
              min={element.range![0] ?? 0}
              max={element.range![1] ?? 0}
              step={
                typeof element.step == 'undefined' || element.step - 0 <= 0.01
                  ? 0.01
                  : element.step
              }
              onChange={(e) => {
                setNumber(e.currentTarget.valueAsNumber);
                handleChange && handleChange(e, element, questionIndex);
              }}
            ></input>
            <span>{(element.range![1] ?? 0).toString()}</span>
          </div>
          <div className="flex flex-row justify-center gap-1">
            <h1>Answer:</h1>
            <h1 className="empty:text-gray-400 empty:before:content-['None']">
              {number}
            </h1>
          </div>
        </div>
      );
    case 'free-response':
      return (
        <div className="mt-2 w-full">
          <input
            className="w-full cursor-text rounded-md border border-neutral-300 bg-white p-2 outline-none focus:border-exeter/50"
            placeholder="Type response here..."
            onChange={(e) =>
              handleChange && handleChange(e, element, questionIndex)
            }
          />
        </div>
      );
    case 'file-upload':
      return (
        <div className="mt-2 w-full">
          {/* Add a styled file input button */}
          <label className="flex cursor-pointer flex-row items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 hover:bg-neutral-50">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                setFile(e.currentTarget.files![0]);
                handleChange && handleChange(e, element, questionIndex);
              }}
            />
            <BsFileEarmarkArrowUp />
            Upload File
          </label>
          <div className="mt-2 text-sm">
            {file ? (
              file.size > 16777216 ? (
                <p className="text-red-500">
                  File size must be less than 16 MB (current size:{' '}
                  {(file.size / 1000000).toFixed(2)} MB)
                </p>
              ) : (
                <p className="text-neutral-800">
                  File: <span className="text-neutral-500">{file.name}</span>{' '}
                  <span className="text-neutral-400">
                    ({humanFileSize(file.size, true, 1)})
                  </span>
                </p>
              )
            ) : (
              <p className="text-neutral-800">
                File: <span className="text-neutral-500">None</span>
              </p>
            )}
          </div>
        </div>
      );
    default:
      return <h1>{"You shouldn't see this"}</h1>;
  }
};

const Question = ({
  questionIndex,
  element,
  handleChange,
}: {
  questionIndex: number;
  element: ISurveyElement;
  handleChange?: (
    e: ChangeEvent<HTMLInputElement>,
    element: ISurveyElement,
    index: number
  ) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-neutral-200 bg-gray-50 p-4 shadow-md">
      <div className="flex flex-row gap-1">
        <h1 className="font-bold text-gray-900">
          {element.title || 'Untitled Question'}
        </h1>
        {element.required ? (
          <span className="text-md font-bold text-exeter">*</span>
        ) : (
          <></>
        )}
      </div>
      <h2 className="text-gray-700">{element.description}</h2>
      <AnswerPanel
        element={element}
        handleChange={handleChange}
        questionIndex={questionIndex}
      />
    </div>
  );
};

export default Question;
