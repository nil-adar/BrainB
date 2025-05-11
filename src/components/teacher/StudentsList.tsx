import { FC } from "react";
import { Student } from "@/types/school";
import { StudentsListHeader } from "@/components/teacher/StudentsListHeader";
import { StudentsListStatus } from "@/components/teacher/StudentsListStatus";
import { useStudentsList } from "@/hooks/useStudentsList";
import { StudentCard } from "@/components/teacher/StudentCard";

interface StudentsListProps {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  searchTerm?: string;
  translations: {
    loading: string;
    error: string;
    classStudents: string;
    mood: string;
    contactParent: string;
    viewProgress: string;
    createAssessment: string;
    viewPreAssessments: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
    progressMessage: string;
    contactMessage: string;
  };
  onViewProgress: (studentId: string) => void;
  onContactParent: (student: Student) => void;
}

export const StudentsList: FC<StudentsListProps> = ({
  students,
  isLoading,
  error,
  searchTerm = "",
  translations: t,
  onViewProgress,
  onContactParent
}) => {
  const { displayStudents } = useStudentsList(
    students,
    isLoading,
    error,
    {
      progressMessage: t.progressMessage,
      contactMessage: t.contactMessage
    }
  );

  // סינון לפי חיפוש
  const filtered = searchTerm
    ? displayStudents.filter(s =>
        (`${s.firstName} ${s.lastName}`)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : displayStudents;

  return (
    <>
      <StudentsListHeader title={t.classStudents} />

      <div className="border rounded-md">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-h-[600px] overflow-y-auto">
          <StudentsListStatus
            isLoading={isLoading}
            error={error}
            translations={{ loading: t.loading, error: t.error }}
          />

          {!isLoading && !error && filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm
                ? `לא נמצאו תלמידים התואמים לחיפוש "${searchTerm}"`
                : "אין תלמידים בכיתה זו"
              }
            </div>
          )}

          {!isLoading && !error && filtered.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              translations={{
                mood: t.mood,
                contactParent: t.contactParent,
                viewProgress: t.viewProgress,
                createAssessment: t.createAssessment,
                viewPreAssessments: t.viewPreAssessments,
                dailyTaskUpdate: t.dailyTaskUpdate,
                viewRecommendations: t.viewRecommendations
              }}
              onViewProgress={() => onViewProgress(student.id)}
              onContactParent={() => onContactParent(student)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
