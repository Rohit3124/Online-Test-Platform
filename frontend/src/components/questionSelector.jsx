/* eslint-disable react/prop-types */
import clsx from "clsx";
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
    not_visited: {
      label: "Not Visited",
      color: "text-gray-700",
      bg: "bg-gray-700",
    },
    not_attempted: {
      label: "Un-answered",
      color: "text-yellow-500",
      bg: "bg-yellow-500",
    },
    attempted: {
      label: "Answered",
      color: "text-green-500",
      bg: "bg-green-500",
    },
    review: { label: "Review", color: "text-blue-500", bg: "bg-blue-500" },
    review_with_answer: {
      label: "Review with Answer",
      color: "text-sky-400",
      bg: "bg-sky-400",
    },
  };

  return (
    <div className="p-6 bg-sky-100 rounded-lg shadow-md">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 bg-sky-100 p-3 rounded-lg text-sm">
        {Object.values(statusColors).map((item, index) => (
          <div
            key={index}
            className="flex gap-1 justify-center items-center text-center"
          >
            <FaCircle className={clsx(item.color)} size={10} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <hr className="my-3 border-t-2 border-white" />

      {/* Subject Selector */}
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

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-4">
        {questions.map((question, index) => {
          const questionStatusKey =
            questionStatus[question._id] || "not_visited";
          return (
            <button
              key={question._id}
              className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white",
                statusColors[questionStatusKey].bg
              )}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionSelector;
