import React from "react";
import { Button } from "@/components/base/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface ControlButtonsProps {
  isActive: boolean;
  toggleTimer: () => void;
  fullReset: () => void;
  skipSession?: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isActive,
  toggleTimer,
  fullReset,
  skipSession,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 my-8">
      {/* Reset Button */}
      <Button
        onClick={fullReset}
        variant="ghost"
        size="icon"
        className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>

      {/* Main Play/Pause Button */}
      <Button
        onClick={toggleTimer}
        className={`
          w-20 h-20 rounded-full text-xl font-bold
          shadow-2xl transition-all duration-300 hover:scale-105
          ${
            isActive
              ? "bg-white text-rose-500 hover:bg-white/90"
              : "bg-white text-emerald-500 hover:bg-white/90"
          }
        `}
      >
        {isActive ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8 ml-1" />
        )}
      </Button>

      {/* Skip Button */}
      {skipSession && (
        <Button
          onClick={skipSession}
          variant="ghost"
          size="icon"
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
        >
          <SkipForward className="h-6 w-6" />
        </Button>
      )}

      {/* Placeholder to balance layout when no skip button */}
      {!skipSession && <div className="w-14 h-14" />}
    </div>
  );
};

export default ControlButtons;
