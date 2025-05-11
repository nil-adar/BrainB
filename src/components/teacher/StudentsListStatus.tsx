
import React from "react";

interface StudentsListStatusProps {
  isLoading: boolean;
  error: Error | null;
  translations: {
    loading: string;
    error: string;
  };
}

export const StudentsListStatus: React.FC<StudentsListStatusProps> = ({ 
  isLoading, 
  error, 
  translations: t 
}) => {
  if (isLoading) {
    return <div className="col-span-full text-center py-8">{t.loading}</div>;
  }

  if (error) {
    return <div className="col-span-full text-center py-8 text-red-500">{t.error}</div>;
  }

  return null;
};
