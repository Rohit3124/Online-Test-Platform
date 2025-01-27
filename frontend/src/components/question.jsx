import { Label, Radio } from "flowbite-react";
import PropTypes from "prop-types";

const QuestionComponent = ({ questionDetails, disableOptions }) => {
  const { index, question, options, correctOption } = questionDetails;

  return (
    <div className="max-w-2xl w-full">
      <div className="flex flex-col gap-4 p-4 border rounded-lg ">
        <legend className="font-semibold mb-2">
          {index + 1}. {question}
        </legend>
        {options.map((option, i) => (
          <div key={i} className="flex items-center gap-2">
            <Radio
              id={`${questionDetails._id}-${i}`}
              name={questionDetails._id}
              value={option}
              disabled={disableOptions}
              defaultChecked={correctOption.includes((i + 1).toString())}
            />
            <Label htmlFor={`${questionDetails._id}-${i}`}>{option}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

QuestionComponent.propTypes = {
  questionDetails: PropTypes.shape({
    index: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    _id: PropTypes.string.isRequired,
    correctOption: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure correctOption is an array
  }).isRequired,
  disableOptions: PropTypes.bool.isRequired,
};

export default QuestionComponent;
