import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { questionnaires } from "@/data/questionnaires";
import { translations } from "@/utils/studentDashboardData";
import { useSettings } from "@/components/SettingsContext";

export default function QuestionnaireFormPage() {
  const navigate = useNavigate();
  const { role, studentId } = useParams<{
    role: "student" | "parent" | "teacher";
    studentId: string;
  }>();
  const { language } = useSettings();
  const t = translations[language];
  const isRTL = language === "he";

  if (!role || !studentId) {
    return <div>שאלון לא נמצא.</div>;
  }

  const idMap: Record<typeof role, string> = {
    student: "questionnaire-1",
    parent:  "questionnaire-2",
    teacher: "questionnaire-3",
  };
  const questionnaire = questionnaires.find(q => q.id === idMap[role]);
  if (!questionnaire) {
    return <div>שאלון לא נמצא.</div>;
  }

  const handleSubmit = async (answers: Record<string, string | string[]>) => {
    try {
       // אופציונלי: לאסוף תגיות של כל השאלות
      const tags = questionnaire.questions
      .map(q => q.tag)
      .filter(t => !!t);

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, role, questionnaireId: questionnaire.id, answers, tags: questionnaire.questions.map(q => q.tag).filter(Boolean)}),
      });
      if (res.ok) {
        toast.success(
          isRTL ? "השאלון נשלח בהצלחה" : "Form submitted successfully"
        );
        navigate(
          role === "student"
            ? "/student-dashboard"
            : role === "parent"
            ? "/parent-dashboard"
            : "/teacher-dashboard"
        );
      } else {
        toast.error(
          isRTL ? "שגיאה בשליחת הטופס" : "Failed to submit form"
        );
      }
    } catch {
      toast.error(isRTL ? "שגיאה בשרת" : "Server error");
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {t[role]?.title ||
          (role === "student"
            ? "שאלון לתלמיד"
            : role === "parent"
            ? "שאלון להורה"
            : "שאלון למורה")}
      </h1>

      <QuestionnaireForm
        questionnaire={questionnaire}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
