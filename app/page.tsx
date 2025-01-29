"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Plus, Minus } from "lucide-react"

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isWork, setIsWork] = useState(true)
  const [sessions, setSessions] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)

  const resetTimer = useCallback(() => {
    setIsActive(false)
    if (isWork) {
      setMinutes(workDuration)
    } else {
      setMinutes(breakDuration)
    }
    setSeconds(0)
  }, [isWork, workDuration, breakDuration])

  const switchMode = useCallback(() => {
    setIsWork(!isWork)
    resetTimer()
    if (isWork) {
      setSessions((s) => s + 1)
    }
  }, [isWork, resetTimer])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          clearInterval(interval)
          switchMode()
        }
      }, 1000)
    } else if (!isActive && (seconds !== 0 || minutes !== 0)) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, minutes, seconds, switchMode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const fullReset = () => {
    setIsActive(false)
    setMinutes(workDuration)
    setSeconds(0)
    setIsWork(true)
    setSessions(0)
  }

  const adjustDuration = (isWork: boolean, increment: boolean) => {
    if (isWork) {
      setWorkDuration((prev) => {
        const newValue = increment ? prev + 1 : prev - 1
        return Math.min(Math.max(newValue, 20), 50)
      })
      if (isWork && !isActive) {
        setMinutes(workDuration)
      }
    } else {
      setBreakDuration((prev) => {
        const newValue = increment ? prev + 1 : prev - 1
        return Math.min(Math.max(newValue, 5), 15)
      })
      if (!isWork && !isActive) {
        setMinutes(breakDuration)
      }
    }
  }

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
        <div className="text-8xl font-bold mb-8 text-center tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
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
        <div className="text-center mb-6">
          <p className="text-xl mb-2">{isWork ? "Work Time" : "Break Time"}</p>
          <p className="text-lg">
            Sessions completed: <span className="font-bold">{sessions}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Work Duration: {workDuration} min</p>
            <div className="flex justify-between">
              <Button onClick={() => adjustDuration(true, false)} disabled={workDuration <= 20}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold">{workDuration}</span>
              <Button onClick={() => adjustDuration(true, true)} disabled={workDuration >= 50}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2">Break Duration: {breakDuration} min</p>
            <div className="flex justify-between">
              <Button onClick={() => adjustDuration(false, false)} disabled={breakDuration <= 5}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold">{breakDuration}</span>
              <Button onClick={() => adjustDuration(false, true)} disabled={breakDuration >= 15}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

