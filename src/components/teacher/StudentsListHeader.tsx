import React from "react";
import { UserCircle } from "lucide-react";

interface StudentsListHeaderProps {
  title: string;
}

export const StudentsListHeader: React.FC<StudentsListHeaderProps> = ({
  title,
}) => {
  return (
    <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2">
      <UserCircle className="w-6 h-6 text-primary" />
      {title}
    </h2>
  );
};
