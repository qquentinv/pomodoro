"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward, ChevronDown, ChevronUp, Minus, Plus, RefreshCw } from "lucide-react";

const THEMES = {
  sunset: {
    name: "Sunset",
    work: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    break: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  aurora: {
    name: "Aurora",
    work: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
    break: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)",
  },
  candy: {
    name: "Candy",
    work: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    break: "linear-gradient(135deg, #5f27cd 0%, #48dbfb 100%)",
  },
  nature: {
    name: "Nature",
    work: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    break: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
  },
};

type ThemeKey = keyof typeof THEMES;

const STORAGE_KEY = "pomodoro-settings";

interface Settings {
  workDuration: number;
  breakDuration: number;
  theme: ThemeKey;
  autoContinue: boolean;
}

function loadSettings(): Settings {
  if (typeof window === "undefined") {
    return { workDuration: 30, breakDuration: 8, theme: "sunset", autoContinue: true };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        workDuration: parsed.workDuration ?? 30,
        breakDuration: parsed.breakDuration ?? 8,
        theme: parsed.theme ?? "sunset",
        autoContinue: parsed.autoContinue ?? true,
      };
    }
  } catch {}
  return { workDuration: 30, breakDuration: 8, theme: "sunset", autoContinue: true };
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function Pomodoro() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [workDuration, setWorkDuration] = useState(30);
  const [breakDuration, setBreakDuration] = useState(8);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("sunset");
  const [autoContinue, setAutoContinue] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const settings = loadSettings();
    setWorkDuration(settings.workDuration);
    setBreakDuration(settings.breakDuration);
    setCurrentTheme(settings.theme);
    setAutoContinue(settings.autoContinue);
    setMinutes(settings.workDuration);
    setIsLoaded(true);
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (isLoaded) {
      saveSettings({ workDuration, breakDuration, theme: currentTheme, autoContinue });
    }
  }, [workDuration, breakDuration, currentTheme, autoContinue, isLoaded]);

  // Update document title with timer when active
  useEffect(() => {
    if (isActive) {
      const time = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      const mode = isWork ? "Focus" : "Break";
      document.title = `${time} - ${mode}`;
    } else {
      document.title = "Pomodoro";
    }
  }, [isActive, minutes, seconds, isWork]);

  const theme = THEMES[currentTheme];

  const resetTimer = useCallback((forWorkMode?: boolean, keepActive?: boolean) => {
    const targetIsWork = forWorkMode ?? isWork;
    if (!keepActive) {
      setIsActive(false);
    }
    if (targetIsWork) {
      setMinutes(workDuration);
    } else {
      setMinutes(breakDuration);
    }
    setSeconds(0);
  }, [isWork, workDuration, breakDuration]);

  const switchMode = useCallback((fromTimerEnd?: boolean) => {
    const newIsWork = !isWork;
    setIsWork(newIsWork);
    const shouldKeepActive = fromTimerEnd && autoContinue;
    resetTimer(newIsWork, shouldKeepActive);
    if (isWork) {
      setSessions((s) => s + 1);
    }
  }, [isWork, resetTimer, autoContinue]);

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
          switchMode(true);
        }
      }, 1000);
    }
    return () => clearInterval(interval ?? undefined);
  }, [isActive, minutes, seconds, switchMode]);

  const toggleTimer = () => setIsActive(!isActive);

  const fullReset = () => {
    setIsActive(false);
    setMinutes(workDuration);
    setSeconds(0);
    setIsWork(true);
    setSessions(0);
  };

  const adjustDuration = (isWorkDuration: boolean, increment: boolean) => {
    if (isWorkDuration) {
      setWorkDuration((prev) => {
        const newValue = Math.min(Math.max(prev + (increment ? 1 : -1), 20), 50);
        if (!isActive && isWork) setMinutes(newValue);
        return newValue;
      });
    } else {
      setBreakDuration((prev) => {
        const newValue = Math.min(Math.max(prev + (increment ? 1 : -1), 5), 15);
        if (!isActive && !isWork) setMinutes(newValue);
        return newValue;
      });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden transition-all duration-1000"
      style={{ background: isWork ? theme.work : theme.break }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Mode badge */}
        <div className="mb-6 relative">
          <span className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium tracking-wide uppercase">
            {isWork ? "Focus" : "Break"}
          </span>
          <button
            onClick={() => setAutoContinue(!autoContinue)}
            className={`group absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
              autoContinue
                ? "text-white/60 hover:text-white/80"
                : "text-white/20 hover:text-white/40"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="absolute left-1/2 -translate-x-1/2 top-8 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Auto-continue {autoContinue ? "on" : "off"}
            </span>
          </button>
        </div>

        {/* Timer */}
        <div className={`text-[10rem] sm:text-[12rem] md:text-[14rem] font-bold leading-none tracking-tighter tabular-nums ${isActive ? "animate-pulse-slow" : ""}`}>
          {String(minutes).padStart(2, "0")}
          <span className="opacity-60">:</span>
          {String(seconds).padStart(2, "0")}
        </div>

        {/* Sessions counter */}
        <p className="mt-4 text-white/60 text-sm tracking-wide">
          {sessions} session{sessions !== 1 ? "s" : ""} completed
        </p>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={fullReset}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={toggleTimer}
            className="w-24 h-24 rounded-full bg-white shadow-2xl shadow-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            {isActive ? (
              <Pause className="w-10 h-10 text-gray-900" />
            ) : (
              <Play className="w-10 h-10 text-gray-900 ml-1" />
            )}
          </button>

          <button
            onClick={switchMode}
            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-all"
      >
        Settings
        {showSettings ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Settings panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl transition-all duration-300 ${
          showSettings ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setShowSettings(false)}
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-all"
        >
          <ChevronDown className="w-4 h-4" />
          Close
        </button>
        <div className="max-w-md mx-auto p-6 pt-10 pb-8">
          {/* Duration controls */}
          <div className="flex gap-8 justify-center mb-6">
            {/* Work duration */}
            <div className="text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Focus</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => adjustDuration(true, false)}
                  disabled={workDuration <= 20}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold w-12 tabular-nums">{workDuration}</span>
                <button
                  onClick={() => adjustDuration(true, true)}
                  disabled={workDuration >= 50}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Break duration */}
            <div className="text-center">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Break</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => adjustDuration(false, false)}
                  disabled={breakDuration <= 5}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-semibold w-12 tabular-nums">{breakDuration}</span>
                <button
                  onClick={() => adjustDuration(false, true)}
                  disabled={breakDuration >= 15}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  currentTheme === key
                    ? "bg-white text-gray-900 font-medium"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
