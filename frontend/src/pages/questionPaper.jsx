import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import QuestionComponent from "../components/question";

const QuestionPaper = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
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
  console.log(questions);
  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, index) => (
        <div
          key={question._id}
          className="flex flex-col items-center justify-center border p-4 rounded-lg"
        >
          <QuestionComponent
            questionDetails={{ ...question, index }}
            disableOptions={false}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionPaper;
