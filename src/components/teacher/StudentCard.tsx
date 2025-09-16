//NOT IN USE PROPBEBLY

import { Student } from "@/types/school";
import { Card } from "@/components/ui/card";
import { StudentCardActions } from "@/components/teacher/StudentCardActions";
import { StudentProfile } from "@/components/teacher/StudentProfile"; // ודא שזה מיובא
import React from "react";

interface StudentCardProps {
  student: Student;
  language: "en" | "he";
  translations: {
    //mood: string;
    contactParent: string;
    //viewProgress: string;
    createAssessment: string;
    //viewPreAssessments: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
  };
  teacherId?: string;
  questionnaireRole?: "student" | "teacher" | "parent";
  onViewProgress: (studentId: string) => void;
  onContactParent: (studentId: string, parentId: string) => void;
}

export const StudentCard = React.memo(
  ({
    student,
    language,
    translations: t,
    teacherId,
    questionnaireRole,
    onViewProgress,
    onContactParent,
  }: StudentCardProps) => {
    const fullName =
      student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student.name;

    return (
      <Card
        className={`bg-teal-50 rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4 ${
          language === "en" ? "text-left" : "text-right"
        }`}
        dir={language === "he" ? "rtl" : "ltr"}
      >
        <StudentProfile
          student={{
            ...student,
            name: fullName,
          }}
        />

        <StudentCardActions
          studentId={student.id}
          studentName={fullName}
          classId={student.classId}
          teacherId={student.teacherId}
          translations={{
            createAssessment: t.createAssessment,
            //viewPreAssessments: t.viewPreAssessments,
            dailyTaskUpdate: t.dailyTaskUpdate,
            viewRecommendations: t.viewRecommendations,
            contactParent: t.contactParent,
            //viewProgress: t.viewProgress,
          }}
          onContactParent={() => {
            if (student.parentIds && student.parentIds.length > 0) {
              onContactParent(student._id, student.parentIds[0]);
            }
          }}
          onViewProgress={() => onViewProgress(student.id)}
        />
      </Card>
    );
  }
);
