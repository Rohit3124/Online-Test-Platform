/* eslint-disable react/prop-types */
import { FaCircle } from "react-icons/fa";

const QuestionSelector = ({
  subjects,
  selectedSubject,
  handleSubjectChange,
  questions,
  questionStatus,
  setCurrentQuestion,
}) => {
  const statusColors = {
    not_attempted: "bg-gray-700 text-white",
    attempted: "bg-blue-500 text-white",
    review: "bg-yellow-500 text-black",
  };

  return (
    <div className=" p-6 bg-sky-100 rounded-lg shadow-md">
      <div className="flex gap-4 justify-start items-center mb-4 text-sm">
        <div className="flex items-center gap-1">
          <FaCircle className="text-gray-700" size="10" />
          <span>Not Attempted</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCircle className="text-blue-500" size="10" />
          <span>Attempted</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCircle className="text-yellow-500" size="10" />
          <span>Review</span>
        </div>
      </div>

      <select
        className="w-1/3 px-4 py-2 mb-4 rounded border-none bg-white text-black outline-none focus:ring-4 focus:ring-blue-400"
        value={selectedSubject}
        onChange={(e) => handleSubjectChange(e.target.value)}
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-5 gap-4">
        {questions.map((question, index) => (
          <button
            key={question._id}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              statusColors[questionStatus[question._id]] ||
              "bg-gray-500 text-white"
            }`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
