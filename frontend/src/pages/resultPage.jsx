import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const ResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const res = await fetch(`/api/result/getResults?resultId=${resultId}`);
        if (!res.ok) {
          return alert("Failed to fetch student results");
        }
        const resultData = await res.json();
        setResult(resultData);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStudentResults();
  }, [resultId]);
  console.log(result);

  return <div>resultPage</div>;
};

export default ResultPage;
