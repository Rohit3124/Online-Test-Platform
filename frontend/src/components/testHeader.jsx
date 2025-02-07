/* eslint-disable react/prop-types */
import { useTimer } from "react-timer-hook";
import { Button } from "flowbite-react";
import { LuAlarmClock } from "react-icons/lu";

const TestHeader = ({
  examDuration,
  subjects,
  selectedSubject,
  handleSubjectChange,
}) => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + examDuration);

  const { seconds, minutes, hours } = useTimer({ expiryTimestamp });
  const totalMinutes = hours * 60 + minutes;

  return (
    <div className="w-2/5 shadow-lg">
      <div className="flex p-5 items-center justify-between">
        <div className="flex items-center gap-2 text-red-500">
          <LuAlarmClock size={"2rem"} />
          <span className="countdown font-sans text-xl font-bold">
            {totalMinutes}:{seconds < 10 ? `0${seconds}` : seconds} MIN
          </span>
        </div>
        <Button gradientMonochrome="success" className="px-5">
          Submit
        </Button>
      </div>
      <div className="flex px-5 py-3 bg-sky-100">
        <select
          className="px-4 py-2 rounded border-none w-1/2  text-black"
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
    </div>
  );
};

export default TestHeader;
