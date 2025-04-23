import { Bell, BarChart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Student } from "@/types/school";

interface StudentCardProps {
  student: Student;
  onViewProgress?: (studentId: string) => void;
  teacherId?: string;
}

const actionTranslations = {
  en: [
    { text: "Create new assessment", path: "/create-assessment" },
    { text: "View Pre-Assessments", path: "/statistics" },
    { text: "Daily Task Update", path: "/daily-tasks" },
    { text: "View recommendations", path: (id: string) => `/student/${id}` }, 
  ],
  he: [
    { text: " צור אבחון חדש ", path: "/create-assessment" },
    { text: "צפה בהערכות", path: "/statistics" },
    { text: "עדכון משימות יומי", path: "/daily-tasks" },
    { text: "צפה בהמלצות", path: (id: string) => `/student/${id}` },
  ]
};

export const StudentCard = ({
  student,
  onViewProgress,
  teacherId = "teacher1" // אפשר לשנות בהמשך ל־logged-in user
}: StudentCardProps) => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const actions = actionTranslations[language];

  const getPath = (path: string | ((id: string) => string)) => {
    if (typeof path === "function") {
      return path(student.id);
    }
  
    // הוספת פרטי תלמיד לנתיב של יצירת אבחון
    if (path === "/create-assessment") {
      const studentName = encodeURIComponent(`${student.firstName} ${student.lastName}`);
      return `/create-assessment?studentId=${student.id}&studentName=${studentName}`;
    }
  
    return path;
  };
  

  const handleViewProgress = () => {
    if (onViewProgress) {
      onViewProgress(student.id);
    } else {
      navigate("/statistics");
    }
  };

  const buttonLabels = {
    en: {
      viewProgress: "View progress",
      contactParent: "Contact parent"
    },
    he: {
      viewProgress: "צפה בהתקדמות",
      contactParent: "צור קשר עם הורה"
    }
  };

  const t = buttonLabels[language];

  return (
    <Card className="bg-secondary p-3 md:p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
          onClick={() => navigate(`/student/${student.id}`)}
        >
          <img
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <h3 className="font-semibold text-base md:text-lg">
            {`${student.firstName} ${student.lastName}`}
          </h3>
        </div>
        <Bell className="text-gray-400 hover:text-accent cursor-pointer w-5 h-5" />
      </div>

      <div className="mt-3 md:mt-4 space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(getPath(action.path))}
            className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            {action.text}
          </button>
        ))}

        <button
          onClick={handleViewProgress}
          className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-between"
        >
          <BarChart className="w-4 h-4" />
          <span>{t.viewProgress}</span>
        </button>

        {student.parentIds.length > 0 && (
          <button
            onClick={() => {}}
            className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-between"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.contactParent}</span>
          </button>
        )}
      </div>
    </Card>
  );
};
