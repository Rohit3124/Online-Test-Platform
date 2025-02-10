import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "flowbite-react";

const ResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [maxMarks, setMaxMarks] = useState(0);
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        const res = await fetch(`/api/result/getResults?resultId=${resultId}`);
        if (!res.ok) {
          return alert("Failed to fetch student results");
        }
        const resultData = await res.json();
        setResult(resultData);

        const response = await fetch(
          `/api/question/getQuestions?testId=${resultData.testId}`
        );
        if (!response.ok) throw new Error("Failed to fetch question details");
        const questions = await response.json();

        const testRes = await fetch(
          `/api/exam/getExams?testId=${resultData.testId}`
        );
        const test = await testRes.json();
        setMaxMarks(test.totalMarks);
        setTotalQuestions(questions.length);

        let score = 0;
        let positiveMarks = 0;
        let negativeMarks = 0;

        let totalCorrect = 0;
        let totalIncorrect = 0;

        let subjectWiseData = {};

        questions.forEach((q) => {
          if (!subjectWiseData[q.subject]) {
            subjectWiseData[q.subject] = {
              correct: 0,
              incorrect: 0,
              unAttempted: 0,
            };
          }
        });

        resultData.students[0].answers.forEach(
          ({ questionId, selectedOption }) => {
            const question = questions.find((q) => q._id === questionId);
            if (!question) return;

            const isCorrect = question.correctOption.includes(selectedOption);
            const marks = question.marks || 0;
            const negMarks = question.negativeMarks || 0;
            const subject = question.subject;

            if (!subjectWiseData[subject]) {
              subjectWiseData[subject] = {
                correct: 0,
                incorrect: 0,
                unAttempted: 0,
              };
            }

            if (isCorrect) {
              score += marks;
              positiveMarks += marks;
              subjectWiseData[subject].correct++;
              totalCorrect++;
            } else {
              score -= negMarks;
              negativeMarks += negMarks;
              subjectWiseData[subject].incorrect++;
              totalIncorrect++;
            }
          }
        );

        let totalUnAttempted = 0;

        Object.keys(subjectWiseData).forEach((subject) => {
          subjectWiseData[subject].unAttempted =
            questions.filter((q) => q.subject === subject).length -
            (subjectWiseData[subject].correct +
              subjectWiseData[subject].incorrect);

          totalUnAttempted += subjectWiseData[subject].unAttempted;
        });

        setMarksData({
          score,
          positiveMarks,
          negativeMarks,
          totalCorrect,
          totalIncorrect,
          totalUnAttempted,
          subjectWiseData,
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStudentResults();
  }, [resultId]);

  return (
    <div className="px-20">
      <div className="flex flex-wrap ">
        <div className="w-1/2">
          <div className="text-2xl mb-3">
            <b>Overall Result</b>
          </div>
          <div>
            <ul className="flex flex-row flex-wrap w-full gap-3">
              <li className="flex flex-col h-20 w-[30%] justify-center items-center bg-gray-100">
                <span className="text-2xl font-bold">
                  {marksData.score}/{maxMarks}
                </span>
                <span className="text-gray-500">Overall Score</span>
              </li>
              <li className="flex flex-col h-20 w-[30%] justify-center items-center bg-gray-100">
                <span className="text-2xl font-bold">
                  {result?.students[0]?.rank || "N/A"}
                </span>
                <span className="text-gray-500">Rank</span>
              </li>
              <li className="flex flex-col h-20 w-[30%] justify-center items-center bg-gray-100">
                <span className="text-2xl font-bold">{maxMarks}</span>
                <span className="text-gray-500">Best Score</span>
              </li>
              <li className="flex flex-col h-20 w-[30%] justify-center items-center bg-gray-100">
                <span className="text-2xl font-bold">
                  {result?.score || "N/A"}
                </span>
                <span className="text-gray-500">Average Score</span>
              </li>
              <li className="flex flex-col h-20 w-[30%] justify-center items-center bg-gray-100">
                <span className="text-2xl font-bold">
                  {totalQuestions
                    ? ((marksData.totalCorrect / totalQuestions) * 100).toFixed(
                        2
                      ) + "%"
                    : "N/A"}
                </span>
                <span className="text-gray-500">Accuracy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2">
          <div className="text-2xl mb-3">
            <b>Overall Marks</b>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex bg-green-500 text-white px-10 py-3 rounded w-1/2 justify-between items-stretch h-20">
              <div className="flex flex-col items-center flex-1 justify-center">
                <span className="text-2xl font-bold">
                  {marksData.positiveMarks}
                </span>
                <span>Positive Marks</span>
              </div>
              <div className="border-l border-white"></div>
              <div className="flex flex-col items-center flex-1 justify-center">
                <span className="text-2xl font-bold">
                  {marksData.totalCorrect}
                </span>
                <span>Correct</span>
              </div>
            </div>

            <div className="flex bg-red-500 text-white px-10 py-3 rounded w-1/2 justify-between items-stretch h-20">
              <div className="flex flex-col items-center flex-1 justify-center">
                <span className="text-2xl font-bold">
                  {marksData.negativeMarks}
                </span>
                <span>Negative Marks</span>
              </div>
              <div className="border-l border-white"></div>
              <div className="flex flex-col items-center flex-1 justify-center">
                <span className="text-2xl font-bold">
                  {marksData.totalIncorrect}
                </span>
                <span>Incorrect</span>
              </div>
            </div>

            <div className="flex bg-yellow-300 text-white px-10 py-3 rounded w-1/2 justify-center items-center h-20">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {marksData.totalUnAttempted}
                </span>
                <span>Unattempted</span>
              </div>
            </div>

            <div className="flex bg-black text-white px-10 py-3  rounded w-1/2 justify-center items-center h-20">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  Final Marks = {marksData.score}/{maxMarks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-7">
        <div className="text-2xl mb-3">
          <b>Subject wise Analysis</b>
        </div>
        <div>
          <Tabs aria-label="Tabs with underline" variant="underline">
            {marksData.subjectWiseData &&
              Object.entries(marksData.subjectWiseData).map(
                ([subject, data]) => (
                  <Tabs.Item active key={subject} title={subject}>
                    <div className="flex gap-16">
                      <div className="flex bg-green-500 text-white px-10 py-3 rounded w-1/3 justify-between items-stretch h-20">
                        <div className="flex flex-col items-center flex-1 justify-center">
                          <span className="text-2xl font-bold">
                            {data.correct}
                          </span>
                          <span>Correct</span>
                        </div>
                      </div>

                      <div className="flex bg-red-500 text-white px-10 py-3 rounded w-1/3 justify-between items-stretch h-20">
                        <div className="flex flex-col items-center flex-1 justify-center">
                          <span className="text-2xl font-bold">
                            {data.incorrect}
                          </span>
                          <span>Incorrect</span>
                        </div>
                      </div>

                      <div className="flex bg-yellow-300 text-white px-10 py-3 rounded w-1/3 justify-center items-center h-20">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold">
                            {data.unAttempted}
                          </span>
                          <span>Unattempted</span>
                        </div>
                      </div>
                    </div>
                  </Tabs.Item>
                )
              )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
