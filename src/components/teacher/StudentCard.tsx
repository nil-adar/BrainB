import { Student } from "@/types/school";
import { Card } from "@/components/ui/card";
import { StudentProfile } from "@/components/teacher/StudentProfile";
import { StudentCardActions } from "@/components/teacher/StudentCardActions";

interface StudentCardProps {
  student: Student;
  translations: {
    mood: string;
    contactParent: string;
    viewProgress: string;
    createAssessment: string;
    viewPreAssessments: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
  };
  onViewProgress: (studentId: string) => void;
  onContactParent: (parentId: string) => void;
}

export const StudentCard = ({
  student,
  translations: t,
  onViewProgress,
  onContactParent
}: StudentCardProps) => {
  return (
    <Card className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4">
      <StudentProfile 
        student={student} 
        moodLabel={t.mood} 
      />

      <StudentCardActions 
        studentId={student.id}
        translations={{
          createAssessment: t.createAssessment,
          viewPreAssessments: t.viewPreAssessments,
          dailyTaskUpdate: t.dailyTaskUpdate,
          viewRecommendations: t.viewRecommendations,
          contactParent: t.contactParent,
          viewProgress: t.viewProgress
        }}
        onContactParent={() => {
          if (student.parentIds.length > 0) {
            onContactParent(student.parentIds[0]);
          }
        }}
        onViewProgress={() => onViewProgress(student.id)}
      />
    </Card>
  );
};
