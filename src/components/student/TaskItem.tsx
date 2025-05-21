
import React from 'react';
import { Star } from 'lucide-react';
import { Number } from 'mongoose';

interface TaskItemProps {
  id: number;
  title: string;
  color: string;
  timeEstimation: string;
  completed: boolean;
  
  category: 'red' | 'green' | 'orange' | 'blue' | 'yellow' | 'purple';
  stars: number;
  onToggleComplete: (id:    number) => void;
  onSelect: () => void;
  isSelected: boolean;
  onDelete: (taskId: number) => void;
}

const categoryColors = {
  red: 'bg-red-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  yellow: 'bg-yellow-200',
  orange: 'bg-orange-200',
  purple: 'bg-purple-200',
};

const TaskItem: React.FC<TaskItemProps> = ({ 
  id, 
  title, 
  timeEstimation, 
  completed, 
  category, 
  stars,
  onToggleComplete,
  onSelect,
  isSelected
}) => {
  return (
    <div 
      className={`flex items-center p-2 rounded-md mb-1 ${categoryColors[category]} cursor-pointer hover:opacity-90 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
      }`}
      onClick={onSelect}
    >
      <div className="mr-2" onClick={(e) => {
        e.stopPropagation();
        onToggleComplete(id);
      }}>
        <button
          className={`h-4 w-4 rounded-full border-2 border-gray-400 flex items-center justify-center ${
            completed ? 'bg-green-500 border-green-500' : 'bg-white'
          }`}
        >
          {completed && (
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 6L5 8L9 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-gray-800">{title}</div>
        <div className="text-[8px] text-gray-600">{timeEstimation}</div>
      </div>
      <div className="flex">
        {[...Array(stars)].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-yellow-500" fill="currentColor" />
        ))}
      </div>
    </div>
  );
};

export default TaskItem;
