import React from "react";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ minutes, seconds }: TimerDisplayProps) => {
  return (
    <div className="text-8xl font-bold mb-8 text-center tabular-nums">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default TimerDisplay;