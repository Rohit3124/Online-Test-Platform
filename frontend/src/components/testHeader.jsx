import React from "react";
import { useTimer } from "react-timer-hook";
const TestHeader = () => {
  const { seconds, minutes, isRunning } = useTimer({ expiryTimestamp });
  return (
    <div>
      <span className="countdown font-mono text-2xl">
        <span style={{ "--value": 24 }}></span>m
        <span style={{ "--value": new Date().getSeconds() }}></span>s
      </span>
    </div>
  );
};

export default TestHeader;
