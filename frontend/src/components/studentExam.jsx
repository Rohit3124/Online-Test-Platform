import { useEffect, useState } from "react";
import { Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const StudentExam = () => {
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
  return (
    <div className="p-3 w-full">
      <div>
        <div className="text-4xl mb-4">Exams</div>
        {exams.length > 0 ? (
          <div className="overflow-x-auto ">
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Exam Name</Table.HeadCell>
                <Table.HeadCell>Exam Date</Table.HeadCell>
                <Table.HeadCell>Subjets</Table.HeadCell>
                <Table.HeadCell>Syllabus</Table.HeadCell>
                <Table.HeadCell>Start Time</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {exams.map((exam, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell>{exam.testName}</Table.Cell>
                    <Table.Cell>
                      {new Date(exam.testDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{exam.subject.join(", ")}</Table.Cell>
                    <Table.Cell>{exam.syllabus}</Table.Cell>
                    <Table.Cell>{exam.startTime}</Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/student/question-paper/${exam._id}`}
                        state={{ exam }}
                      >
                        <Button gradientMonochrome="cyan">Start</Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-2xl">No exams available</div>
        )}
      </div>
    </div>
  );
};

export default StudentExam;
