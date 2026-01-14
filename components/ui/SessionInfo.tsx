import React from "react";

interface SessionInfoProps {
  sessions: number;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ sessions }) => {
  return (
    <div className="text-center">
      <p className="text-sm text-white/70">
        Sessions completed:{" "}
        <span className="font-bold text-white">{sessions}</span>
      </p>
    </div>
  );
};

export default SessionInfo;
