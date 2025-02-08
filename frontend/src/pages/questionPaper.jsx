import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import QuestionComponent from "../components/question";
import TestHeader from "../components/testHeader";
import QuestionSelector from "../components/questionSelector";

const QuestionPaper = () => {
  const { testId } = useParams();
  const location = useLocation();
  const exam = location.state.exam;
  const subjects = exam.subject;
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStatus, setQuestionStatus] = useState(() => {
    const savedStatus = localStorage.getItem(`questionStatus_${testId}`);
    return savedStatus ? JSON.parse(savedStatus) : {};
  });

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
        setCurrentQuestionIndex(0);

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

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const examDuration =
    timeToMinutes(exam.endTime) - timeToMinutes(exam.startTime);

  return (
    <>
      <TestHeader
        examDuration={examDuration}
        subjects={subjects}
        selectedSubject={selectedSubject}
        handleSubjectChange={handleSubjectChange}
      />
      <QuestionSelector
        subjects={subjects}
        selectedSubject={selectedSubject}
        handleSubjectChange={handleSubjectChange}
        questions={questions}
        questionStatus={questionStatus}
        setCurrentQuestion={setCurrentQuestionIndex}
      />

      <div className="flex flex-col gap-6">
        {questions.length > 0 && (
          <div className="flex flex-col items-center justify-center border p-4 rounded-lg">
            <QuestionComponent
              questionDetails={{
                ...questions[currentQuestionIndex],
                index: currentQuestionIndex,
              }}
              disableOptions={false}
              updateQuestionStatus={updateQuestionStatus}
              questionStatus={questionStatus}
            />

            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

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
