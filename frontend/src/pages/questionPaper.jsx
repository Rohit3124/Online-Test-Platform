import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import QuestionComponent from "../components/question";
import TestHeader from "../components/testHeader";

const QuestionPaper = () => {
  const { testId } = useParams();
  const location = useLocation();
  const exam = location.state.exam;
  const subjects = exam.subject;
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [questions, setQuestions] = useState([]);
  const [questionStatus, setQuestionStatus] = useState(() => {
    const savedStatus = localStorage.getItem(`questionStatus_${testId}`);
    return savedStatus ? JSON.parse(savedStatus) : {};
  });
  console.log(questionStatus);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/question/getQuestions?testId=${testId}`
        );
        if (!response.ok) {
          alert("Failed to fetch questions");
          return;
        }
        const questionsData = await response.json();
        const subjectwiseQuestions = questionsData.filter(
          (q) => q.subject === selectedSubject
        );
        setQuestions(subjectwiseQuestions);
        setQuestionStatus((prev) => {
          const newStatus = { ...prev };
          questionsData.forEach((q) => {
            if (!(q._id in newStatus)) {
              newStatus[q._id] = "not_attempted";
            }
          });
          localStorage.setItem(
            `questionStatus_${testId}`,
            JSON.stringify(newStatus)
          );
          return newStatus;
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [testId, selectedSubject]);

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
  };
  const updateQuestionStatus = (questionId, status) => {
    setQuestionStatus((prev) => {
      let updatedStatus = { ...prev, [questionId]: status };

      localStorage.setItem(
        `questionStatus_${testId}`,
        JSON.stringify(updatedStatus)
      );

      return updatedStatus;
    });
  };

  return (
    <>
      <TestHeader />
      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-4 mt-5">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`px-4 py-2 rounded ${
                selectedSubject === subject
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleSubjectChange(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        {questions.map((question, index) => (
          <div
            key={question._id}
            className="flex flex-col items-center justify-center border p-4 rounded-lg"
          >
            <QuestionComponent
              questionDetails={{ ...question, index }}
              disableOptions={false}
              updateQuestionStatus={updateQuestionStatus}
              questionStatus={questionStatus}
            />

            <div className="flex gap-2 mt-2">
              <button
                className={`px-3 py-1 rounded ${
                  questionStatus[question._id] === "attempted"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                disabled
              >
                Attempted
              </button>

              <button
                className={`px-3 py-1 rounded ${
                  questionStatus[question._id] === "not_attempted"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
                disabled
              >
                Not Attempted
              </button>

              <button
                className={`px-3 py-1 rounded ${
                  questionStatus[question._id] === "review"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => updateQuestionStatus(question._id, "review")}
              >
                Mark for Review
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-bold mb-2">Question Status Summary</h2>
          <ul>
            <li>
              Attempted:{" "}
              {
                Object.values(questionStatus).filter((s) => s === "attempted")
                  .length
              }
            </li>
            <li>
              Not Attempted:{" "}
              {
                Object.values(questionStatus).filter(
                  (s) => s === "not_attempted"
                ).length
              }
            </li>
            <li>
              Marked for Review:{" "}
              {
                Object.values(questionStatus).filter((s) => s === "review")
                  .length
              }
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default QuestionPaper;
