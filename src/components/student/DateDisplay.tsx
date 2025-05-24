
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DateDisplayProps {
  className?: string;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ className }) => {
  // Get today's date and format it
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM yyyy");
  
  return (
    <div className={`flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full shadow-md border border-blue-200 dark:border-blue-700 ${className}`}>
      <Calendar size={18} className="text-blue-600 dark:text-blue-400 ml-2" />
      <span className="text-base font-semibold text-blue-800 dark:text-blue-300">
        {formattedDate}
      </span>
    </div>
  );
};

export default DateDisplay;