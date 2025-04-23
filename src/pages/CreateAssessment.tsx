import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { externalAssessmentService } from "@/services/externalAssessmentService";
import { Button } from "@/components/ui/button";
import { studentService } from "@/services/studentService";
import { parentService as authService } from "@/services/parentService";
import { Student, User } from "@/types/school";
import { useQuery } from "@tanstack/react-query";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSearchParams } from "react-router-dom";
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
      "התלמיד יועבר למערכת החיצונית כדי להשלים את האבחון. לאחר השלמתו, התוצאות יישלחו בחזרה למערכת.",
    startAssessment: "התחל אבחון",
  },
};

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "he">(
    document.documentElement.dir === "rtl" ? "he" : "en"
  );
  const t = translations[language];

  // Sync document direction
  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  // Get studentId from URL
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const studentName = searchParams.get("studentName");
  console.log("ID שהגיע מה-URL:", studentId); // <--- הוסף את זה
  console.log("🔍 [CreateAssessment] studentId from URL:", studentId);

  // Fetch the specific student
  const {
    data: student,
    isLoading: loadingStudent,
    error: studentError,
  } = useQuery<Student, Error>({
    queryKey: ["student", studentId],
    enabled: !!studentId,
    queryFn: () => studentService.getStudentById(studentId!),
  });
  console.log("סטטוס טעינה:", loadingStudent); // <--- הוסף את זה
  console.log("שגיאה בטעינה:", studentError);  // <--- הוסף את זה
  console.log("נתוני הסטודנט שהתקבלו:", student); // <--- הוסף את זה

  // Form state
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(today);
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const toggleLanguage = () => setLanguage((prev) => (prev === "he" ? "en" : "he"));

  // Breadcrumbs
  const breadcrumbItems = [
    { label: t.home, href: "/" },
    {
      label: studentName ?? t.loadingStudent,

      href: student ? `/student/${studentId}` : undefined,
    },
    { label: t.createNewAssessment },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      toast({ title: "Error", description: t.errorLoading, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const assessment = await externalAssessmentService.startExternalAssessment(
        studentId,
        "behavioral"
      );
      navigate(`/external-assessment/${assessment.id}`);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to start assessment", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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

        <Card className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">{t.studentName}</label>
              {loadingStudent ? (
                <p>{t.loadingStudent}</p>
              ) : studentError || !student ? (
                <p className="text-red-500">{t.errorLoading}</p>
              ) : (
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={`${student.firstName} ${student.lastName}`}
                  readOnly
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.date}</label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.notes}</label>
              <textarea
                className="w-full p-2 border rounded-lg h-32"
                placeholder={t.addNotes}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800">{t.externalSystem}</h3>
              <p className="text-blue-700 text-sm mt-2">{t.externalSystemExplanation}</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={loading || loadingStudent}
            >
              {loading ? "..." : t.startAssessment}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
