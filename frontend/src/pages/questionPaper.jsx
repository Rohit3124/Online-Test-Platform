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
              newStatus[q._id] = "not_visited";
            }
          });

          if (
            subjectwiseQuestions.length > 0 &&
            Object.keys(prev).length === 0
          ) {
            const firstQuestionId = subjectwiseQuestions[0]._id;
            newStatus[firstQuestionId] = "not_attempted";
          }
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
      let updatedStatus = { ...prev };

      if (status === "review") {
        if (prev[questionId] === "attempted") {
          updatedStatus[questionId] = "review_with_answer";
        } else {
          updatedStatus[questionId] = "review";
        }
      } else {
        updatedStatus[questionId] = status;
      }

      localStorage.setItem(
        `questionStatus_${testId}`,
        JSON.stringify(updatedStatus)
      );

      return updatedStatus;
    });
  };

  const handleQuestionNavigation = (newIndex) => {
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (
      currentQuestionId &&
      questionStatus[currentQuestionId] === "not_visited"
    ) {
      updateQuestionStatus(currentQuestionId, "not_attempted");
    }

    setCurrentQuestionIndex(newIndex);
  };
  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (
        currentQuestionId &&
        questionStatus[currentQuestionId] === "not_visited"
      ) {
        setQuestionStatus((prev) => {
          const updatedStatus = {
            ...prev,
            [currentQuestionId]: "not_attempted",
          };
          localStorage.setItem(
            `questionStatus_${testId}`,
            JSON.stringify(updatedStatus)
          );
          return updatedStatus;
        });
      }
    }
  }, [currentQuestionIndex, questions, questionStatus, testId]);
  const handleMarkForReview = () => {
    const currentQuestionId = questions[currentQuestionIndex]._id;

    setQuestionStatus((prev) => {
      let updatedStatus = { ...prev };

      if (
        prev[currentQuestionId] === "review" ||
        prev[currentQuestionId] === "review_with_answer"
      ) {
        updatedStatus[currentQuestionId] =
          prev[currentQuestionId] === "review_with_answer"
            ? "attempted"
            : "not_attempted";
      } else {
        updatedStatus[currentQuestionId] =
          prev[currentQuestionId] === "attempted"
            ? "review_with_answer"
            : "review";
      }

      localStorage.setItem(
        `questionStatus_${testId}`,
        JSON.stringify(updatedStatus)
      );

      return updatedStatus;
    });
  };

  const handleClearResponse = () => {
    const currentQuestionId = questions[currentQuestionIndex]._id;

    setQuestionStatus((prev) => {
      let updatedStatus = { ...prev };
      if (prev[currentQuestionId] === "review_with_answer") {
        updatedStatus[currentQuestionId] = "review";
      } else {
        updatedStatus[currentQuestionId] = "not_attempted";
      }

      localStorage.setItem(
        `questionStatus_${testId}`,
        JSON.stringify(updatedStatus)
      );

      return updatedStatus;
    });

    localStorage.setItem(
      `selectedOptions_${currentQuestionId}`,
      JSON.stringify([])
    );

    setQuestions((prev) =>
      prev.map((q) =>
        q._id === currentQuestionId ? { ...q, selectedOptions: [] } : q
      )
    );
  };

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const examDuration =
    timeToMinutes(exam.endTime) - timeToMinutes(exam.startTime);

  return (
    <>
      <div className="flex h-screen justify-evenly my-10">
        <div className="w-1/2 flex flex-col gap-5">
          <TestHeader
            examDuration={examDuration}
            subjects={subjects}
            selectedSubject={selectedSubject}
            handleSubjectChange={handleSubjectChange}
          />
          <div>
            {questions.length > 0 && (
              <div className="flex flex-col items-center justify-center border rounded-lg shadow-lg p-4">
                <QuestionComponent
                  questionDetails={{
                    ...questions[currentQuestionIndex],
                    index: currentQuestionIndex,
                  }}
                  disableOptions={false}
                  updateQuestionStatus={updateQuestionStatus}
                  questionStatus={questionStatus}
                />
                <div className="flex justify-evenly w-full">
                  <button
                    className="px-4 py-2 rounded bg-gray-300"
                    disabled={currentQuestionIndex === 0}
                    onClick={() =>
                      handleQuestionNavigation(currentQuestionIndex - 1)
                    }
                  >
                    Previous
                  </button>

                  <div>
                    <button
                      className={`px-4 py-2 rounded bg-blue-500 text-white mr-5`}
                      onClick={handleMarkForReview}
                    >
                      {questionStatus[questions[currentQuestionIndex]?._id] ===
                        "review" ||
                      questionStatus[questions[currentQuestionIndex]?._id] ===
                        "review_with_answer"
                        ? "Clear Review"
                        : "Mark for Review"}
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-red-500 text-white"
                      onClick={handleClearResponse}
                    >
                      Clear Response
                    </button>
                  </div>
                  <button
                    className="px-4 py-2 rounded bg-gray-300"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() =>
                      handleQuestionNavigation(currentQuestionIndex + 1)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-16">
          <QuestionSelector
            subjects={subjects}
            selectedSubject={selectedSubject}
            handleSubjectChange={handleSubjectChange}
            questions={questions}
            questionStatus={questionStatus}
            setCurrentQuestion={setCurrentQuestionIndex}
          />

          <div className="flex flex-col gap-6">
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-bold mb-2">
                Question Status Summary
              </h2>
              <ul>
                <li>
                  Attempted:{" "}
                  {
                    Object.values(questionStatus).filter(
                      (s) => s === "attempted" || s === "review_with_answer"
                    ).length
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
                <li>
                  Not Visited:{" "}
                  {
                    Object.values(questionStatus).filter(
                      (s) => s === "not_visited"
                    ).length
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionPaper;
