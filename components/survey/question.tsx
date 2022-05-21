import { ChangeEvent, useState } from 'react';
import { ISurveyElement } from '../../utilities/manager/SurveyManager';

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
            className="w-full cursor-text rounded-md bg-white p-2"
            placeholder="Type response here..."
            onChange={(e) =>
              handleChange && handleChange(e, element, questionIndex)
            }
          />
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
    <div className="flex flex-col gap-1 rounded-md bg-gray-50 p-4 shadow-md">
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
