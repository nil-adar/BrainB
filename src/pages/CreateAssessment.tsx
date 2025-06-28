import React, { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react"; // Combined Check import
import { useNavigate, useSearchParams } from "react-router-dom"; // Removed unused useParams
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { toast } from "sonner";

import { externalAssessmentService } from "@/services/externalAssessmentService";
import { Button } from "@/components/ui/button";
import { studentService } from "@/services/studentService";
// import { parentService as authService } from "@/services/parentService"; // Removed unused authService
import { Student } from "@/types/school"; // Removed unused User type
import { useQuery } from "@tanstack/react-query";
import { LanguageToggle } from "@/components/LanguageToggle";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Removed unused Alert components

const translations = {
  en: {
    back: "Back",
    createNewAssessment: "Create New Assessment",
    studentName: "Student Name",
    date: "Date",
    notes: "Notes",
    addNotes: "Add notes...",
    home: "Home",
    loadingStudent: "Loading student...",
    errorLoading: "Error loading student",
    externalSystem: "This assessment will be performed in an external system",
    externalSystemExplanation:
      "The student will be redirected to the external system to complete the assessment. After completion, results will be sent back.",
    startAssessment: "Start Assessment",
    success: {
      title: "Assessment Created Successfully",
      description:
        "The student can start the assessment within the next 24 hours.",
      button: "Return to Dashboard",
    },
    error: {
      title: "Error",
      description: "Failed to create assessment",
    },
  },
  he: {
    back: "חזור",
    createNewAssessment: "צור אבחון חדש",
    studentName: "שם התלמיד",
    date: "תאריך",
    notes: "הערות",
    addNotes: "הוסף הערות...",
    home: "דף הבית",
    loadingStudent: "טוען תלמיד...",
    errorLoading: "שגיאה בטעינת תלמיד",
    externalSystem: "אבחון זה יתבצע במערכת חיצונית",
    externalSystemExplanation:
      "התלמיד יקבל הרשאה לביצוע אבחון במערכת חיצונית, לאחר השלמת האבחון התוצאות ישלחו בחזרה למערכת. הרשאה לביצוע האבחון תקפה ליום אחד בלבד.\n\nלפני יצירת אבחון חדש, בבקשה למלא שאלון מורה.",
    startAssessment: "צור אבחון",
    success: {
      title: "האבחון נוצר בהצלחה",
      description: "התלמיד יוכל להתחיל את האבחון במהלך 24 השעות הקרובות.",
      button: "חזרה לדף הבית",
    },
    error: {
      title: "שגיאה",
      description: "יצירת האבחון נכשלה",
    },
  },
};

export default function CreateAssessment() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState<"en" | "he">(
    document.documentElement.dir === "rtl" ? "he" : "en"
  );
  const t = translations[language];
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const studentName = searchParams.get("studentName");
  console.log("ID שהגיע מה-URL:", studentId);
  console.log("🔍 [CreateAssessment] studentId from URL:", studentId);

  const {
    data: student,
    isLoading: loadingStudent,
    error: studentError,
  } = useQuery<Student, Error>({
    queryKey: ["student", studentId],
    enabled: !!studentId,
    queryFn: () => studentService.getStudentById(studentId!),
  });
  console.log("סטטוס טעינה:", loadingStudent);
  console.log("שגיאה בטעינה:", studentError);
  console.log("נתוני הסטודנט שהתקבלו:", student);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "he" ? "en" : "he"));

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    {
      label:
        studentName ?? (loadingStudent ? t.loadingStudent : t.errorLoading), // Improved label for loading/error
      href: student ? `/student/${studentId}` : undefined,
    },
    { label: t.createNewAssessment },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📍 נלחץ כפתור צור אבחון");

    if (!studentId) {
      console.log("❌ חסר studentId");
      toast.error("שגיאה", {
        description: "לא נמצא מזהה תלמיד",
      });
      return;
    }

    try {
      console.log("🧪 בודק האם מולא שאלון מורה...");
      const { hasTeacherForm } = await studentService.checkFormStatus(
        studentId
      );
      console.log("✔️ תוצאת בדיקה: hasTeacherForm =", hasTeacherForm);

      if (!hasTeacherForm) {
        toast.error("נדרש שאלון מורה", {
          description:
            "לפני יצירת אבחון, יש להשלים את שאלון המורה עבור תלמיד זה.",
        });
        return;
      }
    } catch (err) {
      console.error("❌ שגיאה בבדיקת סטטוס שאלון:", err);
      toast.error("שגיאה", {
        description: "לא ניתן לבדוק סטטוס השאלון. נסה שוב מאוחר יותר.",
      });
      return;
    }

    console.log("✅ בדיקה עברה, מתחיל יצירת אבחון...");
    setLoading(true);

    try {
      await externalAssessmentService.startExternalAssessment(
        studentId,
        "behavioral"
      );
      console.log("✅ האבחון נוצר בהצלחה");

      toast.success(t.success.title, {
        description: t.success.description,
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("❌ שגיאה ביצירת אבחון:", err);
      toast.error(t.error.title, {
        description: t.error.description,
      });
    } finally {
      setLoading(false);
      console.log("🔚 סיום תהליך יצירת האבחון");
    }
  }; // <<< Added closing brace and semicolon for the handleSubmit function definition

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumbs items={breadcrumbItems} />
        <LanguageToggle language={language} toggleLanguage={toggleLanguage} />
      </div>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.createNewAssessment}</h1>

        {isSuccess ? (
          <Card className="p-6 border-green-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-700">
                {t.success.title}
              </h3>
              <p className="text-gray-600">{t.success.description}</p>
              <Button onClick={() => navigate("/")} className="mt-4">
                {t.success.button}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.studentName}
                </label>
                {loadingStudent ? (
                  <p>{t.loadingStudent}</p>
                ) : studentError || !student ? (
                  <p className="text-red-500">{t.errorLoading}</p>
                ) : (
                  <>
                    <label
                      htmlFor="assessment-date"
                      className="block text-sm font-medium mb-1"
                    >
                      {t.date}
                    </label>
                    <input
                      id="assessment-date"
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </>
                )}
              </div>

              <div>
                <label
                  htmlFor="assessment-date"
                  className="block text-sm font-medium mb-1"
                >
                  {t.date}
                </label>
                <input
                  id="assessment-date"
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t.notes}
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg h-32"
                  placeholder={t.addNotes}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">
                  {t.externalSystem}
                </h3>
                <p className="text-blue-700 text-sm mt-2">
                  {t.externalSystemExplanation}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                disabled={loading || loadingStudent || !student} // Added !student to disabled condition
              >
                {loading ? "..." : t.startAssessment}
              </Button>
              <Button
                type="button" // Added type="button" to prevent form submission
                className="w-full bg-blue-200 text-blue-900 py-2 rounded-lg hover:bg-blue-300 transition-opacity"
                onClick={() => {
                  if (studentId) {
                    navigate(`/teacher-form?studentId=${studentId}`);
                  } else {
                    toast.error("שגיאה", {
                      description: "לא נמצא מזהה תלמיד",
                    });
                  }
                }}
                disabled={!studentId} // Disable if no studentId
              >
                מלא שאלון מורה
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
