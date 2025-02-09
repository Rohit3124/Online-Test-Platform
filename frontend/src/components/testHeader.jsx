/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTimer } from "react-timer-hook";
import { useParams } from "react-router-dom";
import { Button, Modal } from "flowbite-react";
import { LuAlarmClock } from "react-icons/lu";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { RiFlag2Fill } from "react-icons/ri";

const TestHeader = ({
  examDuration,
  subjects,
  selectedSubject,
  handleSubjectChange,

  handleSubmit,
}) => {
  const { testId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const expiryTimestamp = new Date();
  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + examDuration);

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => setShowModal(true),
  });

  const totalMinutes = hours * 60 + minutes;

  const questionStatus =
    JSON.parse(localStorage.getItem(`questionStatus_${testId}`)) || "{}";

  const attempted = Object.values(questionStatus).filter(
    (s) => s === "attempted" || s === "review_with_answer"
  ).length;

  const notAttempted = Object.values(questionStatus).filter(
    (s) => s === "not_attempted" || s === "not_visited"
  ).length;

  const markedForReview = Object.values(questionStatus).filter(
    (s) => s === "review"
  ).length;

  return (
    <div className="shadow-lg rounded-lg">
      <div className="flex p-5 items-center justify-between">
        <div className="flex items-center gap-2 text-red-500">
          <LuAlarmClock size={"2rem"} />
          <span className="countdown font-sans text-xl font-bold">
            {totalMinutes}:{seconds < 10 ? `0${seconds}` : seconds} MIN
          </span>
        </div>
        <Button
          gradientMonochrome="success"
          className="px-5"
          onClick={() => setShowModal(true)}
        >
          Submit
        </Button>
      </div>

      <div className="flex px-5 py-3 bg-sky-100 rounded-b-btn">
        <select
          className="px-4 py-2 rounded border-none w-1/2 text-black focus:ring-4 focus:ring-blue-400"
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
        className="rounded-lg"
      >
        <Modal.Header className="bg-blue-500">
          <div className="text-white text-center">
            <h2 className="text-xl font-bold">
              Are you sure you want to submit the test?
            </h2>
            <p className="text-lg">
              After submitting, you won’t be able to re-attempt.
            </p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col  text-lg">
            <div className=" flex items-center justify-between mx-10 ">
              <div className="flex items-center gap-3">
                <LuAlarmClock size={"1.5rem"} className=" text-red-500" />
                <p>Time Left:</p>
              </div>
              <span className="countdown font-sans ">
                {totalMinutes}:{seconds < 10 ? `0${seconds}` : seconds} MIN
              </span>
            </div>
            <div className=" flex items-center justify-between mx-10">
              <div className="flex items-center gap-3 ">
                <IoIosCheckmarkCircle
                  className="text-green-500"
                  size={"1.5rem"}
                />
                <p>Attempted:</p>
              </div>
              <span>{attempted}</span>
            </div>
            <div className=" flex items-center justify-between mx-10">
              <div className="flex items-center gap-3">
                <IoIosCloseCircle className="text-red-500" size={"1.5rem"} />
                <p>Unattempt:</p>
              </div>
              <span>{notAttempted}</span>
            </div>
            <div className=" flex items-center justify-between mx-10">
              <div className="flex items-center gap-3 ">
                <RiFlag2Fill className="text-blue-500" size={"1.5rem"} />
                <p>Marked for Review:</p>
              </div>
              <span>{markedForReview}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-evenly">
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestHeader;
