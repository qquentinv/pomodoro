import React from "react";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  isWork: boolean;
  isActive: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  minutes,
  seconds,
  isWork,
  isActive,
}) => {
  return (
    <div className="relative">
      {/* Mode indicator badge */}
      <div className="text-center mb-4">
        <span
          className={`
            inline-block px-4 py-1.5 rounded-full text-sm font-medium
            ${isWork ? "bg-white/20" : "bg-white/30"}
            backdrop-blur-sm transition-all duration-300
          `}
        >
          {isWork ? "Focus Time" : "Break Time"}
        </span>
      </div>

      {/* Main timer display */}
      <div
        className={`
          text-[7rem] sm:text-[8rem] md:text-[10rem] font-bold text-center tabular-nums
          leading-none tracking-tight
          ${isActive ? "animate-pulse-slow" : ""}
          drop-shadow-lg transition-all duration-300
        `}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
};

export default TimerDisplay;
