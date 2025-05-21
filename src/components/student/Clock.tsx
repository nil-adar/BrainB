
import React, { useState, useEffect } from 'react';

interface ClockProps {
  currentTask?: {
    title: string;
    id?: string | number;
    minutes?: number;
    completed?: boolean;
  } | null;
}

const Clock: React.FC<ClockProps> = ({ currentTask }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update the time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format the time
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-5">
        {hours}:{minutes}:{seconds}
      </div>
      {currentTask && (
        <div className="text-lg md:text-xl font-medium text-center mt-2">
          <div className="text-base md:text-lg text-gray-500">Current Task:</div>
          <div className="font-semibold text-xl md:text-2xl">{currentTask.title}</div>
        </div>
      )}
    </div>
  );
};

export default Clock;