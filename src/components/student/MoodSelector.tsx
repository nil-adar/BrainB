
import React from 'react';

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodSelect }) => {
  const moods = [
    { emoji: "😔", id: "sad" },
    { emoji: "😐", id: "neutral" },
    { emoji: "😊", id: "happy" },
  ];

  return (
    <div className="mb-3 text-center">
      <div className="flex space-x-1 justify-center">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onMoodSelect(mood.id)}
            className={`h-7 w-7 text-base flex items-center justify-center rounded-full ${
              selectedMood === mood.id ? 'bg-cyan-100 ring-1 ring-cyan-400' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
