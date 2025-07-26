// src/components/student/TaskItem.tsx
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ImageIcon, Clock, Pause, Play, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskItemProps {
  id: string;
  title: string;
  timeEstimation: string;
  color: string;
  stars: number;
  completed: boolean;
  onToggleComplete: (id: string) => void;
  onSelect: () => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  category: "red" | "green" | "orange" | "blue" | "yellow" | "purple";
  onImageUpload?: (id: String, imageUrl: string) => void;
  onTogglePause?: (id: string) => void;
  isPaused?: boolean;
  extraTime?: number;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  timeEstimation,
  color,
  stars,
  completed,
  onToggleComplete,
  onSelect,
  onDelete,
  isSelected,
  category,
  onImageUpload,
  onTogglePause,
  isPaused,
  extraTime,
}) => {
  console.log("⏱️ extraTime:", extraTime);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  useEffect(() => {
    const minutesMatch = timeEstimation.match(/^(\d+)/);
    if (minutesMatch && minutesMatch[1]) {
      const minutes = parseInt(minutesMatch[1], 10);
      const adjustedMinutes = extraTime ? minutes * extraTime : minutes;

      setTotalTimeInSeconds(Math.floor(adjustedMinutes * 60));
    }
  }, [timeEstimation, extraTime]);

  useEffect(() => {
    if (isSelected && !startTime) {
      setStartTime(new Date());
      setElapsedTime(0);
      toast.info("Upload an image to complete this task", {
        description: "Click the image icon to upload a photo for this task",
        duration: 4000,
      });
    } else if (!isSelected) {
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [isSelected]);

  useEffect(() => {
    if (!isSelected) {
      setHasUploadedImage(completed);
    }
  }, [isSelected, completed]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSelected && startTime && !isPaused) {
      timer = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSelected, startTime, isPaused]);

  const getCategoryStyles = () => {
    const baseStyles =
      "border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 p-3 mb-3 cursor-pointer";
    const categoryStyles = {
      red: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
      green:
        "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
      blue: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
      yellow:
        "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
      orange:
        "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800",
      purple:
        "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
    };
    const selectedStyles = isSelected
      ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 shadow-md"
      : "";
    const pausedStyles =
      isSelected && isPaused ? "ring-amber-500 dark:ring-amber-400" : "";
    return cn(
      baseStyles,
      categoryStyles[category],
      selectedStyles,
      pausedStyles
    );
  };
  const getTailwindBgColor = (color: string): string => {
    switch (color) {
      case "red":
        return "bg-red-200 dark:bg-red-800";
      case "green":
        return "bg-green-200 dark:bg-green-800";
      case "blue":
        return "bg-blue-200 dark:bg-blue-800";
      case "yellow":
        return "bg-yellow-200 dark:bg-yellow-800";
      case "purple":
        return "bg-purple-200 dark:bg-purple-800";
      case "orange":
        return "bg-orange-200 dark:bg-orange-800";
      default:
        return "bg-slate-200 dark:bg-slate-700";
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex items-center mt-1">
        {Array.from({ length: count }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="text-yellow-400 fill-yellow-400 mr-0.5"
          />
        ))}
        {count > 0 && <span className="text-xs text-gray-500 ml-1">קושי</span>}
      </div>
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    if (onImageUpload) {
      onImageUpload(id, imageUrl);
    }
    setHasUploadedImage(true);
    if (!completed) {
      onToggleComplete(id);
    }
    toast.success("Task image uploaded successfully!");
  };

  const triggerFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleTogglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePause) {
      onTogglePause(id);
    }
  };

  const handleAttemptComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasUploadedImage && !completed) {
      toast.error("You must upload an image to complete this task", {
        description: "Click the image icon to upload a photo",
        duration: 5000,
      });
      const uploadButton =
        e.currentTarget.previousElementSibling?.previousElementSibling;
      if (uploadButton instanceof HTMLElement) {
        uploadButton.classList.add("animate-pulse", "ring", "ring-red-500");
        setTimeout(() => {
          uploadButton.classList.remove(
            "animate-pulse",
            "ring",
            "ring-red-500"
          );
        }, 2000);
      }
      return;
    }
    onToggleComplete(id);
  };

  return (
    <div className="flex flex-col">
      <div className={getCategoryStyles()} onClick={onSelect}>
        <div
          className={`w-10 h-10 rounded-full ${getTailwindBgColor(
            color
          )} flex items-center justify-center`}
        >
          {}
        </div>

        <div className="flex-grow">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {extraTime && extraTime !== 1
              ? `${Math.floor(
                  parseInt(timeEstimation) * extraTime
                )} דקות (מותאם)`
              : `${timeEstimation.replace("דקות", "").trim()} דקות`}
          </p>

          {renderStars(stars)}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-6 h-6 rounded-full text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
                  onClick={triggerFileInput}
                  title="Upload task image"
                >
                  <ImageIcon size={16} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload an image to complete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isSelected && onTogglePause && (
            <button
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                isPaused
                  ? "text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                  : "text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
              )}
              onClick={handleTogglePause}
              title={isPaused ? "Resume timer" : "Pause timer"}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}

          <button
            className={cn(
              "w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center transition-colors",
              completed
                ? "bg-green-500 border-green-500 text-white"
                : "bg-white dark:bg-slate-800"
            )}
            onClick={handleAttemptComplete}
          >
            {completed && <Check size={12} />}
          </button>

          <button
            className="w-6 h-6 rounded-full text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
