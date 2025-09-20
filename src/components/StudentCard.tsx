import React from "react";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Student } from "@/types/school";

interface StudentCardProps {
  student: Student;
  onViewProgress?: (studentId: string) => void;
  onContactParent?: (studentId: string, parentId: string) => void;
  teacherId?: string;
  questionnaireRole?: "student" | "teacher" | "parent";
  language: "he" | "en";
  translations: {
    createAssessment: string;
    fillQuestionnaire: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
    viewProgress: string;
    contactParent: string;
  };
}

export const StudentCard = React.memo<StudentCardProps>(
  ({
    student,
    onViewProgress,
    onContactParent,
    teacherId,
    questionnaireRole,
    language,
    translations: t,
  }) => {
    const formRole = questionnaireRole ?? (teacherId ? "teacher" : "student");
    const navigate = useNavigate();

    const actions = React.useMemo(
      () => [
        {
          text: t.createAssessment,
          path: (id: string) => `/create-assessment?studentId=${id}`,
        },
        {
          text: t.fillQuestionnaire,
          path: (id: string) => `/questionnaire/${formRole}/${id}`,
        },
        {
          text: t.dailyTaskUpdate,
          path: "/daily-tasks",
        },
        {
          text: t.viewRecommendations,
          path: (id: string) => `/recommendations?studentId=${id}`,
        },
      ],
      [t, formRole]
    );

    const getPath = React.useCallback(
      (path: string | ((id: string) => string)) => {
        if (typeof path === "function") {
          return path(student.id);
        }

        if (path === "/daily-tasks") {
          return `/daily-tasks/${teacherId}/${student.classId}`;
        }

        return path;
      },
      [student.id, student.classId, teacherId]
    );

    const handleViewProgress = React.useCallback(() => {
      if (onViewProgress) {
        onViewProgress(student.id);
      } else {
        navigate("/statistics");
      }
    }, [onViewProgress, student.id, navigate]);

    const handleContactParent = React.useCallback(() => {
      if (student.parentIds.length > 0) {
        onContactParent?.(student.id, student.parentIds[0]);
      }
    }, [onContactParent, student.id, student.parentIds]);

    return (
      <Card
        className={`bg-teal-50 rounded-lg border shadow-sm hover:shadow-md transition-shadow p-3 md:p-4 ${
          language === "en" ? "text-left" : "text-right"
        }`}
        dir={language === "he" ? "rtl" : "ltr"}
      >
        {/* פרופיל התלמיד */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => navigate(`/recommendations?studentId=${student.id}`)}
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
          <Bell className="text-gray-400 hover:text-zinc-800 cursor-pointer w-5 h-5" />
        </div>

        {/* כפתורי פעולה */}
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(getPath(action.path))}
              className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-emerald-200 text-zinc-800 rounded hover:opacity-90 transition-opacity text-sm md:text-base"
              style={{ textAlign: language === "he" ? "right" : "left" }}
            >
              <span>{action.text}</span>
            </button>
          ))}

          {/* כפתור צור קשר עם הורה */}
          {student.parentIds.length > 0 && (
            <button
              onClick={handleContactParent}
              className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-emerald-200 text-zinc-800 rounded hover:opacity-90 transition-opacity text-sm md:text-base"
              style={{ textAlign: language === "he" ? "right" : "left" }}
            >
              <span>{t.contactParent}</span>
            </button>
          )}
        </div>
      </Card>
    );
  }
);

StudentCard.displayName = "StudentCard";
