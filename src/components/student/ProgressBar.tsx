
import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 'h-3',
  color = 'bg-purple-600'
}) => {
  // Ensure progress is within bounds
  const boundedProgress = Math.min(Math.max(progress, 0), 100);
  
  // הגדלת גובה סרגל ההתקדמות
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height === 'h-3' ? 'h-4' : height}`}>
        <div
          className={`${color} rounded-full transition-all duration-500 ease-out ${height === 'h-3' ? 'h-4' : height}`}
          style={{ width: `${boundedProgress}%` }}
        />
      </div>
      <div className="mt-3 text-center text-base font-medium text-gray-600 dark:text-gray-300">
        {Math.round(boundedProgress)}% הושלם
      </div>
    </div>
  );
};

export default ProgressBar;