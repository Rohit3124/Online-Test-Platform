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
    not_visited: { label: "Not Visited", color: "gray-700" },
    not_attempted: { label: "Un-answered", color: "yellow-500" },
    attempted: { label: "Answered", color: "green-500" },
    review: { label: "Review", color: "blue-500" },
    review_with_answer: { label: "Review with Answer", color: "sky-400" },
  };

  return (
    <div className=" p-6 bg-sky-100 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-6  bg-sky-100 p-3 rounded-lg text-sm">
        {Object.values(statusColors).map((item, index) => (
          <div
            key={index}
            className="flex gap-1 justify-center items-center text-center"
          >
            <FaCircle className={`text-${item.color}`} size={10} />
            <span className="">{item.label}</span>
          </div>
        ))}
      </div>
      <hr className="my-3 border-t-2 border-white" />
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
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold 
              bg-${
                statusColors[questionStatus[question._id] || "not_visited"]
                  .color || "gray-500"
              } text-white`}
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
