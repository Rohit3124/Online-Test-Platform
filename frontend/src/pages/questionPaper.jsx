import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
  return <div>questionPaper</div>;
};

export default QuestionPaper;
