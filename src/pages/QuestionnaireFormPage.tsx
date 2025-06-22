import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { questionnaires } from "@/data/questionnaires";
import { translations } from "@/utils/studentDashboardData";
import { useSettings } from "@/components/SettingsContext";

export default function QuestionnaireFormPage() {
  //Routing hook from react-router
  const navigate = useNavigate();
  //URL-param hook from react-router
  const { role, studentId } = useParams<{
    role: "student" | "parent" | "teacher";
    studentId: string;
  }>();
  //Context hook for your settings (language/RTL)
  const { language } = useSettings();
  const t = translations[language];
  const isRTL = language === "he";

  //Track answers so we can filter questions dynamically
  const [answers, setAnswers] = React.useState<
    Record<string, string | string[]>
  >({});

  if (!role || !studentId) {
    return <div>שאלון לא נמצא.</div>;
  }

  const idMap: Record<typeof role, string> = {
    student: "questionnaire-1",
    parent: "questionnaire-2",
    teacher: "questionnaire-3",
  };
  const questionnaire = questionnaires.find((q) => q.id === idMap[role]);
  if (!questionnaire) {
    return <div>שאלון לא נמצא.</div>;
  }

  const handleSubmit = async (answers: Record<string, string | string[]>) => {
    const validTags: string[] = [];
    const allergyTags: string[] = [];

    //go trough every question
    questionnaire.questions.forEach((question) => {
      const answer = answers[question.id];

      // 1. שאלות SINGLE עם תשובות opt3 או opt4
      if (
        question.type === "single" &&
        question.tag &&
        question.tag !== "allergy" &&
        (answer === "opt3" || answer === "opt4")
      ) {
        // האם זו מחרוזת אחת עם פסיקים?
        if (question.tag.includes(",")) {
          const splitTags = question.tag.split(",").map((tag) => tag.trim()); // מסיר רווחים
          validTags.push(...splitTags); // מוסיף כל תג בנפרד
        } else {
          validTags.push(question.tag);
        }
      }
      // 2. שאלות MULTIPLE עם תג allergy — נשמרות אם q2-19 = "yes"
      if (
        question.type === "multiple" &&
        question.tag === "allergy" &&
        answers["q2-19"] === "yes" &&
        Array.isArray(answer)
      ) {
        allergyTags.push(...answer); // לדוגמה: ["mango", "milk"]
      }
    });

    try {
      const payload = {
        studentId,
        role,
        questionnaireId: questionnaire.id,
        answers,
        tags: validTags,
        //allergyTags,
      };

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        toast.error(isRTL ? "שגיאה בשליחת הטופס" : "Failed to submit form");
      }
    } catch {
      toast.error(isRTL ? "שגיאה בשרת" : "Server error");
    }
  };

  // 2) Filter q2-18 by q2-17==='opt2', and q2-20..q2-29 by q2-19==='yes'
  const filteredQuestions = questionnaire.questions.filter((q) => {
    if (q.id === "q2-18") {
      return answers["q2-17"] === "opt2";
    }
    const allergyGroup = [
      "q2-20",
      "q2-21",
      "q2-22",
      "q2-23",
      "q2-24",
      "q2-25",
      "q2-26",
      "q2-27",
      "q2-28",
      "q2-29",
    ];
    if (allergyGroup.includes(q.id)) {
      return answers["q2-19"] === "yes";
    }
    return true;
  });

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
        questionnaire={{ ...questionnaire, questions: filteredQuestions }}
        answers={answers} // pass current answers
        onChange={(
          id,
          value // update answers on each change
        ) => setAnswers((prev) => ({ ...prev, [id]: value }))}
        onSubmit={handleSubmit}
      />
    </div>
  );

  /* return (
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
  );*/
}
