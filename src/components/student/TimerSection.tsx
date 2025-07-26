// src/components/student/TimerSection.tsx
import Clock from "@/components/student/Clock";
import HourglassTimer from "@/components/student/HourglassTimer";
import ProgressBar from "@/components/student/ProgressBar";

interface TimerSectionProps {
  showTimer: boolean;
  currentTask: {
    title: string;
  } | null;
  timeLeft: number | null;
  totalTime: number;
  progress: number;
  noTaskMessage: string;
  minutesLeftText: string;
}

const TimerSection = ({
  showTimer,
  currentTask,
  timeLeft,
  totalTime,
  progress,
  noTaskMessage,
  minutesLeftText,
}: TimerSectionProps) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg border border-blue-100 dark:border-gray-700 shadow-md p-4 h-[350px] flex flex-col items-center order-1 md:order-2">
      <div className={`flex-1 w-full mb-2 ${showTimer ? "hidden" : ""}`}>
        <Clock currentTask={currentTask} />
      </div>
      <div className={`flex-1 w-full ${showTimer ? "" : "hidden"}`}>
        <HourglassTimer
          timeLeft={timeLeft ?? 0}
          totalTime={totalTime}
          taskTitle={currentTask?.title ?? ""}
          noTaskMessage={noTaskMessage}
          minutesLeftText={minutesLeftText}
          showTimeText={false}
          timerColor="#8B5CF6"
        />
      </div>
      <div className="w-full max-w-lg mt-auto px-2">
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default TimerSection;
