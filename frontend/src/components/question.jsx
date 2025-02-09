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
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const savedSelection =
      JSON.parse(localStorage.getItem(`selectedOptions_${_id}`)) || [];
    setSelectedOptions(savedSelection);
  }, [_id]);

  useEffect(() => {
    localStorage.setItem(
      `selectedOptions_${_id}`,
      JSON.stringify(selectedOptions)
    );
  }, [selectedOptions, _id]);

  useEffect(() => {
    if (questionStatus?.[_id] === "not_attempted") {
      setSelectedOptions([]);
    }
  }, [questionStatus, _id]);

  const handleCheckboxChange = (option) => {
    let updatedSelection = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedSelection);

    // Check if the question is currently marked for review
    const isCurrentlyReviewed =
      questionStatus[_id] === "review" ||
      questionStatus[_id] === "review_with_answer";

    // Determine new status
    let newStatus;
    if (updatedSelection.length > 0) {
      newStatus = isCurrentlyReviewed ? "review_with_answer" : "attempted";
    } else {
      newStatus = isCurrentlyReviewed ? "review" : "not_attempted";
    }

    updateQuestionStatus(_id, newStatus);
  };

  return (
    <div className="max-w-2xl w-full my-5">
      <div className="flex flex-col gap-4 p-4 border rounded-lg">
        <legend className="font-semibold mb-2 text-lg">
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
            <Label htmlFor={`${_id}-${i}`} className="text-lg">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionComponent;
