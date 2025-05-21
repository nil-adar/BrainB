import React from 'react';
import { Check, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  id: number;
  title: string;
  timeEstimation?: string;
  color?: string;
  stars?: number;
  completed?: boolean;
  onToggleComplete: (id: number) => void;
  onSelect: () => void;
  onDelete: (id: number) => void;
  isSelected?: boolean;
  category?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  timeEstimation,
  color = 'bg-blue-100',
  stars = 0,
  completed = false,
  onToggleComplete,
  onSelect,
  onDelete,
  isSelected = false,
  category
}) => {
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  // הקטנת הגודל של האלמנטים לפי התמונה שהועלתה
  return (
    <div
      onClick={onSelect}
      className={cn(
        'mb-3 cursor-pointer p-3 rounded-lg shadow-sm transition-all duration-300',
        color,
        completed ? 'opacity-70' : 'hover:shadow-md',
        isSelected ? 'ring-2 ring-blue-500 shadow-md' : '',
        completed ? 'line-through' : ''
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-medium">{title}</h3>
          {timeEstimation && (
            <div className="text-xs text-gray-600 mt-1">{timeEstimation}</div>
          )}
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {stars > 0 && (
            <div className="flex">
              {[...Array(stars)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" 
                  strokeWidth={1.5}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleToggleComplete}
            className={cn(
              'p-2 rounded-full',
              completed ? 'bg-green-500 text-white' : 'bg-white/80 border border-gray-300'
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={completed ? 2 : 1.5} />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-white/80 hover:bg-red-100 border border-gray-300 text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;