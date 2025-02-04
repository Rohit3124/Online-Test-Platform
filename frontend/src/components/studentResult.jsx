import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";

const StudentResult = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchStudentResults = async () => {
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
  }, []);
  console.log(results);
  return (
    <div className="p-3 w-full">
      <div>
        <div className="text-4xl mb-4">Results</div>
        {results.length > 0 ? (
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
            </Table>
          </div>
        ) : (
          <div className="text-2xl">No exams available</div>
        )}
      </div>
    </div>
  );
};

export default StudentResult;
