import React from "react";
import { Button } from "@/components/base/button";
import { Plus, Minus } from "lucide-react";

interface DurationAdjusterProps {
  isWork: boolean;
  duration: number;
  adjustDuration: (isWork: boolean, increment: boolean) => void;
}

const DurationAdjuster: React.FC<DurationAdjusterProps> = ({ isWork, duration, adjustDuration }) => {
  return (
    <div>
      <p className="mb-2">{isWork ? "Work Duration" : "Break Duration"}: {duration} min</p>
      <div className="flex justify-between">
        <Button onClick={() => adjustDuration(isWork, false)} disabled={duration <= (isWork ? 20 : 5)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-bold">{duration}</span>
        <Button onClick={() => adjustDuration(isWork, true)} disabled={duration >= (isWork ? 50 : 15)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DurationAdjuster;