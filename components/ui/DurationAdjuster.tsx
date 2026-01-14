import React from "react";
import { Button } from "@/components/base/button";
import { Plus, Minus } from "lucide-react";

interface DurationAdjusterProps {
  isWork: boolean;
  duration: number;
  adjustDuration: (isWork: boolean, increment: boolean) => void;
}

const DurationAdjuster: React.FC<DurationAdjusterProps> = ({
  isWork,
  duration,
  adjustDuration,
}) => {
  const minValue = isWork ? 20 : 5;
  const maxValue = isWork ? 50 : 15;

  return (
    <div className="p-4 rounded-xl bg-white/5">
      <p className="text-sm text-white/70 mb-3">
        {isWork ? "Work" : "Break"} Duration
      </p>
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => adjustDuration(isWork, false)}
          disabled={duration <= minValue}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-2xl font-bold tabular-nums">{duration} min</span>
        <Button
          onClick={() => adjustDuration(isWork, true)}
          disabled={duration >= maxValue}
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DurationAdjuster;
