
import React from "react";
import { useNavigate } from "react-router-dom";

interface UserTypeCardProps {
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
}

function UserTypeCard({ title, onClick, icon }: UserTypeCardProps) {
  return (
    <div 
      className="cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-card animate-fadeIn border border-border"
      onClick={onClick}
    >
      <div className="h-48 flex items-center justify-center">
        <div className="p-6 flex flex-col items-center justify-center gap-4 transition-transform duration-500 group-hover:scale-110">
          {icon}
          <h3 className="text-xl font-bold text-center group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}

interface UserTypesSectionProps {
  forTeachers: string;
  forStudents: string;
  forParents: string;
  icons: {
    teacher: React.ReactNode;
    student: React.ReactNode;
    parent: React.ReactNode;
  };
}

export function UserTypesSection({ forTeachers, forStudents, forParents, icons }: UserTypesSectionProps) {
  const navigate = useNavigate();

  const handleUserTypeClick = (userType: string) => {
    navigate("/login", { state: { userType } });
  };

  return (
    <section className="py-16 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <UserTypeCard
          title={forTeachers}
          onClick={() => handleUserTypeClick("teacher")}
          icon={icons.teacher}
        />
        <UserTypeCard
          title={forStudents}
          onClick={() => handleUserTypeClick("student")}
          icon={icons.student}
        />
        <UserTypeCard
          title={forParents}
          onClick={() => handleUserTypeClick("parent")}
          icon={icons.parent}
        />
      </div>
    </section>
  );
}
