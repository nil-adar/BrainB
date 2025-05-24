
import React, { useEffect, useState } from 'react';

interface ClockProps {
  currentTask: any;
}

const Clock: React.FC<ClockProps> = ({ currentTask }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate hand rotation angles
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours % 12 + minutes / 60) / 12) * 360;

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="w-48 h-48 rounded-full bg-white dark:bg-gray-800 border-4 border-slate-200 dark:border-slate-700 shadow-lg relative">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-4 bg-slate-800 dark:bg-slate-200"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-17px)`,
                transformOrigin: 'bottom center',
                left: 'calc(50% - 0.5px)'
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 h-14 bg-slate-800 dark:bg-slate-200 rounded-full origin-bottom"
            style={{ transform: `rotate(${hourAngle}deg)` }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-18 bg-slate-600 dark:bg-slate-300 rounded-full origin-bottom"
            style={{ transform: `rotate(${minuteAngle}deg)` }}
          />
          
          {/* Second hand */}
          <div
            className="absolute w-0.5 h-20 bg-purple-500 rounded-full origin-bottom"
            style={{ transform: `rotate(${secondAngle}deg)` }}
          />
          
          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full" />
        </div>
      </div>
      
      <div className="mt-4 text-xl font-medium text-slate-700 dark:text-slate-300">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default Clock;