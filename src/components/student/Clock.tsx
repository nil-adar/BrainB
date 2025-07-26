import React, { useEffect, useState } from "react";

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
  const hourAngle = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="w-48 h-48 rounded-full bg-white dark:bg-gray-800 border-4 border-slate-200 dark:border-slate-700 shadow-lg relative overflow-hidden">
        {/* Hour markers */}
        <div className="absolute inset-0 rounded-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-0 bg-slate-800 dark:bg-slate-200 rounded-sm"
              style={{
                top: "8px",
                left: "50%",
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: "50% 88px", // 96px (רדיוס) - 8px (מיקום עליון)
              }}
            />
          ))}
        </div>

        {/* Numbers */}
        <div className="absolute inset-0 rounded-full">
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = i * 30 - 90; // התחל מ-12 בשעון
            const radius = 80; // מרחק מהמרכז
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={num}
                className="absolute text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center w-6 h-6"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(${x - 12}px, ${y - 12}px)`,
                }}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Clock hands container - זה הקטע החשוב לתיקון */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Hour hand */}
          <div
            className="absolute w-1 h-14 bg-slate-800 dark:bg-slate-200 rounded-full"
            style={{
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: "center bottom",
              bottom: "50%",
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-18 bg-slate-600 dark:bg-slate-300 rounded-full"
            style={{
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: "center bottom",
              bottom: "50%",
            }}
          />

          {/* Second hand */}
          <div
            className="absolute w-0.5 h-20 bg-purple-500 rounded-full transition-transform duration-75"
            style={{
              transform: `rotate(${secondAngle}deg)`,
              transformOrigin: "center bottom",
              bottom: "50%",
            }}
          />

          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-purple-500 rounded-full z-10 shadow-sm" />
        </div>
      </div>

      <div className="mt-4 text-xl font-medium text-slate-700 dark:text-slate-300 font-mono">
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>

      {/* Task indicator */}
      {currentTask && (
        <div className="mt-3 text-center">
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            משימה נוכחית:
          </div>
          <div className="text-sm text-slate-800 dark:text-slate-200 font-semibold truncate max-w-48">
            {currentTask.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;
