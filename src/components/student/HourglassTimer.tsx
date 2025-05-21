
import React from 'react';
import { Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HourglassTimerProps {
  timeLeft: number | null;
  totalTime: number;
  taskTitle?: string;
  noTaskMessage?: string;
  minutesLeftText?: string;
  showTimeText?: boolean;
  timerColor?: string;
}

export const HourglassTimer: React.FC<HourglassTimerProps> = ({ 
  timeLeft, 
  totalTime, 
  taskTitle,
  noTaskMessage = "No task selected",
  minutesLeftText = "minutes left",
  showTimeText = false, // Default to false to not show the numeric timer
  timerColor = "#8B5CF6" // Default purple color
}) => {
  // Calculate percentage for visual representation
  const percentage = timeLeft ? Math.min(Math.max((timeLeft / totalTime) * 100, 0), 100) : 0;
  
  // Format time for display (only shown if showTimeText is true)
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {showTimeText && (
        <>
          <div className="text-3xl font-bold mb-3">
            {formatTime(timeLeft)}
          </div>
          
          <div className="text-base text-center mb-8">
            {timeLeft ? minutesLeftText : noTaskMessage}
          </div>
        </>
      )}
      
      {/* Simple countdown progress bar with consistent color */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="w-full mb-10">
         <Progress 
  value={percentage}
  className="h-2 bg-gray-200 dark:bg-gray-700 transition-all duration-1000"
  style={{ backgroundColor: timerColor }}
/>

        </div>
        
        <Timer 
          className="text-gray-500 dark:text-gray-400 mb-5" 
          size={40} 
          strokeWidth={1.5}
        />
      </div>
      
      {/* Task name display */}
      {taskTitle && (
        <div className="mt-8 text-center">
          <h3 className="font-medium text-xl text-gray-700 dark:text-gray-300">Current Task</h3>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">{taskTitle}</p>
        </div>
      )}
    </div>
  );
};

export default HourglassTimer;