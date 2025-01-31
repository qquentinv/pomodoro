"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/base/button";
import { Moon, Sun } from "lucide-react";
import TimerDisplay from "@/components/ui/TimerDisplay";
import ControlButtons from "@/components/ui/ControlButtons";
import SessionInfo from "@/components/ui/SessionInfo";
import DurationAdjuster from "@/components/ui/DurationAdjuster";

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (isWork) {
      setMinutes(workDuration);
    } else {
      setMinutes(breakDuration);
    }
    setSeconds(0);
  }, [isWork, workDuration, breakDuration]);

  const switchMode = useCallback(() => {
    setIsWork(!isWork);
    resetTimer();
    if (isWork) {
      setSessions((s) => s + 1);
    }
  }, [isWork, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval ?? undefined);
          switchMode();
        }
      }, 1000);
    } else if (!isActive && (seconds !== 0 || minutes !== 0)) {
      clearInterval(interval ?? undefined);
    }
    return () => clearInterval(interval ?? undefined);
  }, [isActive, minutes, seconds, switchMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fullReset = () => {
    setIsActive(false);
    setMinutes(workDuration);
    setSeconds(0);
    setIsWork(true);
    setSessions(0);
  };

  const adjustDuration = (isWork: boolean, increment: boolean) => {
    if (isWork) {
      setWorkDuration((prev) => {
        const newValue = increment ? prev + 1 : prev - 1;
        if (!isActive) {
          setMinutes(newValue);
        }
        return Math.min(Math.max(newValue, 20), 50);
      });
    } else {
      setBreakDuration((prev) => {
        const newValue = increment ? prev + 1 : prev - 1;
        if (!isActive) {
          setMinutes(newValue);
        }
        return Math.min(Math.max(newValue, 5), 15);
      });
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`p-8 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg ${
          isDarkMode ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-70"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Pomodoro Timer</h1>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`rounded-full ${isDarkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-200 text-gray-900"}`}
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
        <TimerDisplay minutes={minutes} seconds={seconds} />
        <ControlButtons isActive={isActive} toggleTimer={toggleTimer} fullReset={fullReset} />
        <SessionInfo isWork={isWork} sessions={sessions} />
        <div className="grid grid-cols-2 gap-4">
          <DurationAdjuster isWork={true} duration={workDuration} adjustDuration={adjustDuration} />
          <DurationAdjuster isWork={false} duration={breakDuration} adjustDuration={adjustDuration} />
        </div>
      </div>
    </div>
  );
}
