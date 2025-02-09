import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const StudentResult = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);

  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const studentId = currentUser?._id;

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

  useEffect(() => {
    const fetchStudentResults = async () => {
      if (!studentId) return;

      try {
        const res = await fetch(`/api/result/getResults`);
        if (!res.ok) {
          return alert("Failed to fetch student results");
        }
        const resultData = await res.json();
        setResults(resultData);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStudentResults();
  }, [studentId]);

  const mergedData = results
    .map((result) => {
      const exam = exams.find((exam) => exam._id === result.testId);
      const studentResult = result.students.find(
        (s) => s.studentId === studentId
      );

      if (!exam || !studentResult) return null;

      return {
        examName: exam.testName,
        examDate: exam.testDate,
        subjects: exam.subject.join(", "),
        syllabus: exam.syllabus,
        score: studentResult.score,
        rank: studentResult.rank,
        resultId: result._id,
      };
    })
    .filter(Boolean);

  return (
    <div className="p-3 w-full">
      <div>
        <div className="text-4xl mb-4">Results</div>
        {mergedData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Exam Name</Table.HeadCell>
                <Table.HeadCell>Exam Date</Table.HeadCell>
                <Table.HeadCell>Subjects</Table.HeadCell>
                <Table.HeadCell>Syllabus</Table.HeadCell>
                <Table.HeadCell>Score</Table.HeadCell>
                <Table.HeadCell>Rank</Table.HeadCell>
                <Table.HeadCell>Result</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {mergedData.map((data, index) => (
                  <Table.Row key={index} className="border-b">
                    <Table.Cell>{data.examName}</Table.Cell>
                    <Table.Cell>
                      {new Date(data.examDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{data.subjects}</Table.Cell>
                    <Table.Cell>{data.syllabus}</Table.Cell>
                    <Table.Cell>{data.score}</Table.Cell>
                    <Table.Cell>{data.rank}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/student/exam-result/${data.resultId}`}>
                        <Button gradientMonochrome="info">Result</Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-2xl">No results</div>
        )}
      </div>
    </div>
  );
};

export default StudentResult;
