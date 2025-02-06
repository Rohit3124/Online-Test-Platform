/* eslint-disable react/prop-types */
import { Label, Checkbox } from "flowbite-react";
import { useState, useEffect } from "react";

const QuestionComponent = ({
  questionDetails,
  disableOptions,
  updateQuestionStatus,
  questionStatus,
}) => {
  const { index, question, options, correctOption, _id } = questionDetails;
  const initialSelection =
    JSON.parse(localStorage.getItem(`selectedOptions_${_id}`)) || [];
  const [selectedOptions, setSelectedOptions] = useState(initialSelection);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    localStorage.setItem(
      `selectedOptions_${_id}`,
      JSON.stringify(selectedOptions)
    );
  }, [selectedOptions, _id]);

  useEffect(() => {
    if (questionStatus && questionStatus[_id] === "review") {
      setSelectedOptions([]);
      localStorage.setItem(`selectedOptions_${_id}`, JSON.stringify([]));
    }
  }, [questionStatus, _id]);

  const handleCheckboxChange = (option) => {
    let updatedSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedSelection);

    const newStatus =
      updatedSelection.length > 0 ? "attempted" : "not_attempted";
    updateQuestionStatus(_id, newStatus);
  };

  return (
    <div className="max-w-2xl w-full">
      <div className="flex flex-col gap-4 p-4 border rounded-lg">
        <legend className="font-semibold mb-2">
          {index + 1}. {question}
        </legend>
        {options.map((option, i) => (
          <div key={i} className="flex items-center gap-2">
            <Checkbox
              id={`${_id}-${i}`}
              name={_id}
              value={option}
              checked={
                !user.isAdmin
                  ? selectedOptions.includes(option)
                  : correctOption.includes(String(i + 1))
              }
              onChange={() => handleCheckboxChange(option)}
              disabled={disableOptions}
            />
            <Label htmlFor={`${_id}-${i}`}>{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionComponent;
