import React from "react";
import { Hourglass } from "lucide-react";

interface HourglassTimerProps {
  timeLeft: number | null;
  totalTime: number;
  taskTitle?: string;
  noTaskMessage?: string;
  minutesLeftText?: string;
  showTimeText?: boolean;
  timerColor?: string;
  isPaused?: boolean;
}

const HourglassTimer: React.FC<HourglassTimerProps> = ({
  timeLeft,
  totalTime,
  taskTitle,
  noTaskMessage = "No task selected",
  minutesLeftText = "minutes left",
  showTimeText = false,
  timerColor = "#8B5CF6",
  isPaused = false,
}) => {
  if (!timeLeft && timeLeft !== 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-lg text-slate-500 dark:text-slate-400">
          {noTaskMessage}
        </div>
      </div>
    );
  }

  const percentage =
    timeLeft && totalTime
      ? Math.max(0, Math.min(100, (timeLeft / totalTime) * 100))
      : 0;
  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  // Calculate the animation duration based on the total time (slower for longer tasks)
  const animationDuration = Math.max(2, Math.min(4, totalTime / 120)); // Between 2-4s for animation

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {taskTitle && (
        <div className="text-lg font-medium mb-4 text-slate-700 dark:text-slate-300 text-center">
          {taskTitle}
          {isPaused && (
            <span className="ml-2 text-amber-500 text-sm font-normal">
              (Paused)
            </span>
          )}
        </div>
      )}

      <div className="w-32 h-48 relative mb-2">
        {/* Decorative elements - stars around the timer */}
        <div className="absolute -top-3 -left-4 w-6 h-6 text-yellow-400 animate-pulse">
          ✦
        </div>
        <div
          className="absolute -top-5 left-8 w-6 h-6 text-yellow-400 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          ⭐
        </div>
        <div
          className="absolute -top-3 -right-4 w-6 h-6 text-yellow-400 animate-pulse"
          style={{ animationDelay: "1.2s" }}
        >
          ✦
        </div>

        {/* Background frame */}
        <div
          className="absolute inset-0 border-4 border-slate-300 dark:border-slate-600 backdrop-blur-sm bg-white/20 dark:bg-slate-800/20 overflow-hidden"
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 45%, 50% 50%, 100% 55%, 100% 100%, 0% 100%, 0% 55%, 50% 50%, 0% 45%)",
          }}
        >
          {" "}
          {/* Top glass with animated particles */}
          <div
            className="absolute top-0 left-0 right-0 backdrop-blur-sm"
            style={{
              height: `${100 - percentage}%`,
              transition: isPaused ? "none" : "height 1s linear",
            }}
          >
            {/* Animated small particles in top chamber */}
            {!isPaused &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`top-particle-${i}`}
                  className="absolute rounded-full bg-slate-300/70 dark:bg-slate-500/70"
                  style={{
                    width: `${Math.random() * 5 + 2}px`,
                    height: `${Math.random() * 5 + 2}px`,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    animation: `float ${
                      animationDuration + Math.random()
                    }s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
          </div>
          {/* Sand particles section */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{
              height: `${percentage}%`,
              transition: isPaused ? "none" : "height 1s linear",
            }}
          >
            {/* Animated "sand" using background */}
            <div
              className="absolute inset-0"
              style={{
                background: isPaused
                  ? `linear-gradient(135deg, #F59E0B 25%, #FBBF24 50%, #F59E0B 75%)`
                  : `linear-gradient(135deg, ${timerColor} 25%, ${adjustColor(
                      timerColor,
                      30
                    )} 50%, ${timerColor} 75%)`,
                backgroundSize: isPaused ? "30px 30px" : "20px 20px",
                animation: isPaused
                  ? "none"
                  : "sandAnimation 2s linear infinite",
              }}
            />

            {/* Falling sand particles */}
            {!isPaused &&
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`sand-particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 6 + 3}px`,
                    height: `${Math.random() * 6 + 3}px`,
                    backgroundColor: adjustColor(
                      timerColor,
                      Math.random() * 20
                    ),
                    left: `${Math.random() * 80 + 10}%`,
                    animation: `fall ${
                      animationDuration - 0.5
                    }s ease-in infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
          </div>
          {/* Middle connector with animated flow */}
          <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center z-10">
            <div className="w-8 h-3 bg-slate-300 dark:bg-slate-600 rounded-full relative overflow-hidden">
              {!isPaused && (
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="h-full w-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${timerColor} 0%, transparent 70%)`,
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hourglass icon overlay when paused */}
        {isPaused && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-500 animate-pulse">
            <Hourglass size={32} />
          </div>
        )}
      </div>

      <style>
        {`
        @keyframes sandAnimation {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        
        @keyframes fall {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          100% { transform: translateY(-10px) translateX(5px) rotate(10deg); }
        }
        `}
      </style>
    </div>
  );
};

// Helper function to lighten or darken a color
function adjustColor(color: string, amount: number) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (color.length === 7) {
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  } else {
    // Handle shorthand hex
    r = parseInt(color.substring(1, 2), 16);
    g = parseInt(color.substring(2, 3), 16);
    b = parseInt(color.substring(3, 4), 16);
    r = r * 17;
    g = g * 17;
    b = b * 17;
  }

  // Add amount to each component
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  // Convert back to hex
  const rr =
    r.toString(16).length === 1 ? "0" + r.toString(16) : r.toString(16);
  const gg =
    g.toString(16).length === 1 ? "0" + g.toString(16) : g.toString(16);
  const bb =
    b.toString(16).length === 1 ? "0" + b.toString(16) : b.toString(16);

  return `#${rr}${gg}${bb}`;
}

export default HourglassTimer;
