import { ISurveyElement } from '../../utilities/manager/SurveyManager';

const Question = ({ element }: { element: ISurveyElement }) => {
  const AnswerPanel = () => {
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
              <span>{element.range![0].toString()}</span>
              <input
                type="range"
                className="w-full"
                min={element.range![0]}
                max={element.range![1]}
                step={
                  typeof element.step == 'undefined' || element.step - 0 <= 0.01
                    ? 0.01
                    : element.step
                }
              ></input>
              <span>{element.range![1].toString()}</span>
            </div>
            <div className="flex flex-row justify-center gap-1">
              <h1>Answer:</h1>
              <h1>10</h1>
            </div>
          </div>
        );
      case 'free-response':
        return (
          <div className="mt-2 w-full">
            <p
              className="w-full cursor-text rounded-md bg-white p-2 empty:text-gray-400 empty:before:content-['Type_response_here...']"
              contentEditable
            />
          </div>
        );
      default:
        return <h1>{"You shouldn't see this"}</h1>;
    }
  };

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
      <AnswerPanel />
    </div>
  );
};

export default Question;
