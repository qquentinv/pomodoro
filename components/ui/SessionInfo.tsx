import React from "react";

interface SessionInfoProps {
  isWork: boolean;
  sessions: number;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ isWork, sessions }) => {
  return (
    <div className="text-center mb-6">
      <p className="text-xl mb-2">{isWork ? "Work Time" : "Break Time"}</p>
      <p className="text-lg">
        Sessions completed: <span className="font-bold">{sessions}</span>
      </p>
    </div>
  );
};

export default SessionInfo;