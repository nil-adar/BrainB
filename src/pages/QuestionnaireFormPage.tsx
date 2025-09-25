import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import QuestionnaireForm from "@/components/QuestionnaireForm";
import { questionnaires } from "@/data/questionnaires";
import { translations } from "@/utils/studentDashboardData";
import { useSettings } from "@/components/SettingsContext";
import { ArrowLeft } from "lucide-react";

/**
 * QuestionnaireFormPage.tsx
 *
 * Renders the questionnaire form for student, parent, or teacher.
 *
 * 🔍 Responsibilities:
 * - Loads the relevant questionnaire based on user role and studentId from URL
 * - Tracks and updates answers, including conditional logic (e.g., allergy-related questions)
 * - Filters displayed questions dynamically based on previous answers
 * - Submits completed form to the server via POST request
 * - Handles unsaved exit confirmation modal
 *
 * 🌐 Localization: Hebrew & English (RTL/LTR support)
 * 📦 UI: Lucide icons, Toaster (sonner), and internal QuestionnaireForm component
 */

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

  const dashboardPath =
    role === "student"
      ? "/student-dashboard"
      : role === "parent"
      ? "/parent-dashboard"
      : "/teacher-dashboard";

  //Track answers so we can filter questions dynamically
  type RichAnswer = {
    questionId: string;
    response: string | string[];
    tag?: string[];
    type?: string;
    text?: string;
  };

  const [answers, setAnswers] = React.useState<RichAnswer[]>([]);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

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

  const handleBackClick = () => {
    if (answers.length > 0) {
      setShowExitConfirm(true);
    } else {
      navigate(dashboardPath);
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    navigate(dashboardPath);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleSubmit = async (answers: RichAnswer[]) => {
    const payload = {
      studentId,
      role,
      questionnaireId: questionnaire.id,
      answers,
    };

    try {
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

  const getAnswer = (qid: string) =>
    answers.find((a) => a.questionId === qid)?.response;

  const filteredQuestions = questionnaire.questions.filter((q) => {
    if (q.id === "q2-18") {
      return getAnswer("q2-17") === "opt2";
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
      return getAnswer("q2-19") === "yes";
    }
    return true;
  });

  const handleChange = (answer: {
    questionId: string;
    response: string | string[];
    tag?: string[];
    type?: string;
    text?: string;
  }) => {
    const question = questionnaire.questions.find(
      (q) => q.id === answer.questionId
    );
    if (!question) return;

    const answeredYesAllergy =
      answers.find((a) => a.questionId === "q2-19")?.response === "yes";

    const shouldTagAsAllergy =
      answer.questionId === "q2-19" ||
      (question.tag === "allergy" &&
        question.type === "multiple" &&
        answeredYesAllergy);

    const updatedAnswer = {
      questionId: answer.questionId,
      response: answer.response,
      tag: (() => {
        if (answeredYesAllergy) return ["allergy"];
        if (question.tag?.includes(",")) {
          return question.tag.split(",").map((t) => t.trim());
        }
        return question.tag ? [question.tag] : [];
      })(),

      type: question.type,
      text: question.text[language],
    };

    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === answer.questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === answer.questionId ? updatedAnswer : a
        );
      } else {
        return [...prev, updatedAnswer];
      }
    });
  };

  const getFallbackTitle = (role: string, language: "en" | "he") => {
    const titles = {
      en: {
        student: "Student Questionnaire",
        parent: "Parent Questionnaire",
        teacher: "Teacher Questionnaire",
      },
      he: {
        student: "שאלון לתלמיד",
        parent: "שאלון להורה",
        teacher: "שאלון למורה",
      },
    };

    return (
      titles[language][role as keyof (typeof titles)[typeof language]] ||
      "Questionnaire"
    );
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="p-4 max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className={`w-6 h-6 ${isRTL ? "rotate-180" : ""}`} />
          <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
            {isRTL ? "חזרה" : "Back"}
          </span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">
        {t[role]?.title || getFallbackTitle(role, language)}
      </h1>

      <QuestionnaireForm
        questionnaire={{ ...questionnaire, questions: filteredQuestions }}
        answers={answers}
        onChange={handleChange}
        onSubmit={() => handleSubmit(answers)}
      />

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {isRTL ? "האם אתה בטוח?" : "Are you sure?"}
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              {isRTL
                ? "האם אתה בטוח שאתה רוצה לחזור אחורה ולנטוש את השאלון? כל התשובות שלך יאבדו."
                : "Are you sure you want to go back and abandon the questionnaire? All your answers will be lost."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelExit}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                {isRTL ? "ביטול" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                {isRTL ? "כן, חזור" : "Yes, go back"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
