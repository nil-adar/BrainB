import { Student } from "@/types/school";
import { Card } from "@/components/ui/card";
import { StudentCardActions } from "@/components/teacher/StudentCardActions";
import { StudentProfile } from "@/components/teacher/StudentProfile"; // ודא שזה מיובא

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
  onContactParent: (studentId: string, parentId: string) => void;

}

export const StudentCard = ({
  student,
  translations: t,
  onViewProgress,
  onContactParent
}: StudentCardProps) => {
  const fullName = student.firstName && student.lastName
    ? `${student.firstName} ${student.lastName}`
    : student.name;

  return (
    <Card className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4">
      <StudentProfile 
        student={{
          ...student,
          name: fullName
        }} 
        moodLabel={t.mood} 
      />

      <StudentCardActions 
        studentId={student.id}
        studentName={fullName}
        classId={student.classId}  
        teacherId={student.teacherId}  
        translations={{
          createAssessment: t.createAssessment,
          viewPreAssessments: t.viewPreAssessments,
          dailyTaskUpdate: t.dailyTaskUpdate,
          viewRecommendations: t.viewRecommendations,
          contactParent: t.contactParent,
          viewProgress: t.viewProgress
        }}
       onContactParent={() => {
  if (student.parentIds && student.parentIds.length > 0) {
    onContactParent(student._id
, student.parentIds[0]);
  }
}}

        onViewProgress={() => onViewProgress(student.id)}
      />
    </Card>
  );
};
