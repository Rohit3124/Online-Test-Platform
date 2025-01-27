import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionComponent from "../components/question";
import { Button } from "flowbite-react";

const ExamDetails = () => {
  const [questions, setQuestions] = useState([]);
  const { testId } = useParams();
  const navigate = useNavigate();

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
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [testId]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exam Details</h1>
        <button
          className="bg-gray-700 text-white py-2 px-4 rounded-lg"
          onClick={() => navigate("/admin-dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
      {questions.length > 0 ? (
        <div className="flex flex-col gap-6">
          {questions.map((question, index) => (
            <div
              key={question._id}
              className="flex flex-col  items-center justify-center border p-4 rounded-lg"
            >
              <QuestionComponent
                questionDetails={{ ...question, index }}
                disableOptions={true}
              />

              <div className="max-w-sm w-full flex justify-between mt-4">
                <span className="text-teal-500 hover:underline">Edit</span>
                <span className="font-medium text-red-500 hover:underline cursor-pointer">
                  Delete
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No questions available for this test.</p>
      )}
    </div>
  );
};

export default ExamDetails;
