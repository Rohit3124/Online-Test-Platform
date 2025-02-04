import { useState, useEffect } from "react";
const ExamResult = () => {
  const [exams, setExams] = useState([]);
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(`/api/exam/getExams`);
        if (!res.ok) {
          return alert("Failed to fetch exams");
        }
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchExams();
  }, []);
  return <div>examResult</div>;
};

export default ExamResult;
