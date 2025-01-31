import React from "react";
import { Button } from "@/components/base/button";

interface ControlButtonsProps {
  isActive: boolean;
  toggleTimer: () => void;
  fullReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isActive, toggleTimer, fullReset }) => {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      <Button
        onClick={toggleTimer}
        className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors ${
          isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {isActive ? "Pause" : "Start"}
      </Button>
      <Button
        onClick={fullReset}
        className="px-6 py-2 rounded-full text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 transition-colors text-white"
      >
        Reset All
      </Button>
    </div>
  );
};

export default ControlButtons;