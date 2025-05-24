
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type Mood = "happy" | "neutral" | "sad" | "excited" | "tired";

interface MoodSelectorProps {
  feeling: string;
  onMoodSelect?: (mood: Mood) => void;
  initialMood?: Mood | null;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  feeling, 
  onMoodSelect,
  initialMood = null
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(initialMood);

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", gradient: "from-yellow-200 to-amber-200 dark:from-yellow-800 dark:to-amber-800 border-yellow-300 dark:border-yellow-700" },
    { id: "neutral", emoji: "😐", label: "Neutral", gradient: "from-gray-200 to-slate-200 dark:from-gray-800 dark:to-slate-800 border-gray-300 dark:border-gray-700" },
    { id: "sad", emoji: "😔", label: "Sad", gradient: "from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 border-purple-300 dark:border-purple-700" },
    { id: "excited", emoji: "😃", label: "Excited", gradient: "from-green-200 to-emerald-200 dark:from-green-800 dark:to-emerald-800 border-green-300 dark:border-green-700" },
    { id: "tired", emoji: "😴", label: "Tired", gradient: "from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 border-blue-300 dark:border-blue-700" }
  ];

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-medium mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        {feeling}
      </h3>
      <div className="flex gap-6 justify-center flex-wrap">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={cn(
              "text-5xl rounded-2xl w-24 h-24 flex items-center justify-center transition-all duration-300",
              selectedMood === mood.id 
                ? `bg-gradient-to-br ${mood.gradient} shadow-inner scale-110 transform border-2` 
                : `bg-gradient-to-br ${mood.gradient}/30 backdrop-blur-sm border shadow-lg hover:${mood.gradient}/50 hover:scale-105 transform`
            )}
            onClick={() => handleMoodSelect(mood.id as Mood)}
            aria-label={mood.label}
          >
            <span className="transform hover:scale-110 transition-transform duration-200 drop-shadow-md">{mood.emoji}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="mt-6 text-center">
          <span className={cn(
            "inline-block px-6 py-2 rounded-full bg-gradient-to-r shadow-md backdrop-blur-sm border text-sm font-medium",
            selectedMood === "happy" && "from-yellow-100 to-amber-100 dark:from-yellow-900/70 dark:to-amber-900/70 text-amber-800 dark:text-amber-200 border-yellow-200 dark:border-yellow-800",
            selectedMood === "neutral" && "from-gray-100 to-slate-100 dark:from-gray-900/70 dark:to-slate-900/70 text-slate-800 dark:text-slate-200 border-gray-200 dark:border-gray-800",
            selectedMood === "sad" && "from-purple-100 to-blue-100 dark:from-purple-900/70 dark:to-blue-900/70 text-blue-800 dark:text-blue-200 border-purple-200 dark:border-purple-800",
            selectedMood === "excited" && "from-green-100 to-emerald-100 dark:from-green-900/70 dark:to-emerald-900/70 text-emerald-800 dark:text-emerald-200 border-green-200 dark:border-green-800",
            selectedMood === "tired" && "from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/70 text-indigo-800 dark:text-indigo-200 border-blue-200 dark:border-blue-800"
          )}>
            {moods.find(m => m.id === selectedMood)?.label}
          </span>
        </div>
      )}
    </div>
  );
};