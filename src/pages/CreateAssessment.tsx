import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { externalAssessmentService } from "@/services/externalAssessmentService";
import { Button } from "@/components/ui/button";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/school";
import { useQuery } from "@tanstack/react-query";
import { LanguageToggle } from "@/components/LanguageToggle";

const translations = {
  en: {
    back: "Back",
    createNewAssessment: "Create New Assessment",
    studentName: "Student Name",
    selectStudent: "Select Student",
    date: "Date",
    notes: "Notes",
    addNotes: "Add notes...",
    createAssessment: "Create Assessment for Student",
    home: "Home",
    loadingStudents: "Loading students...",
    externalSystem: "This assessment will be performed in an external system",
    externalSystemExplanation: "The student  will be redirected to the external system to complete the assessment. After completion, results will be sent back to BrainBridge.",
    startAssessment: "Open assessment for student "
  },
  he: {
    back: "חזור",
    createNewAssessment: "צור אבחון לתמיד",
    studentName: "שם התלמיד",
    selectStudent: "בחר תלמיד",
    date: "תאריך",
    notes: "הערות",
    addNotes: "הוסף הערות...",
    createAssessment: "צור הערכה",
    home: "דף הבית",
    loadingStudents: "טוען תלמידים...",
    externalSystem: "אבחון זה יתבצע במערכת חיצונית",
    externalSystemExplanation: "התלמיד יועבר למערכת החיצונית כדי להשלים את האבחון. לאחר השלמתו, התוצאות יישלחו בחזרה למערכת BrainBridge.",
    startAssessment: " פתח גישה לתלמיד לאבחון   "
  }
};

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "he">(document.documentElement.dir === "rtl" ? "he" : "en");
  const t = translations[language];

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>(language === "he"
    ? ""
    : "");
  const [loading, setLoading] = useState<boolean>(false);

  const assessmentType = "behavioral";
  const isExternalAssessment = true;

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAllStudents
  });

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: selectedStudent ? students?.find(s => s.id === selectedStudent)?.name || "" : "", 
      href: selectedStudent ? `/student/${selectedStudent}` : "" },
    { label: t.createNewAssessment },
  ];

  const toggleLanguage = () => {
    const newLang = language === "he" ? "en" : "he";
    setLanguage(newLang);
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תלמיד",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const assessment = await externalAssessmentService.startExternalAssessment(
        selectedStudent,
        assessmentType
      );
      navigate(`/external-assessment/${assessment.id}`);
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת האבחון",
        variant: "destructive",
      });
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
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">{t.selectStudent}</option>
                {isLoadingStudents ? (
                  <option disabled>{t.loadingStudents}</option>
                ) : (
                  students?.map((student: Student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))
                )}
              </select>
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
              disabled={loading}
            >
              {t.startAssessment}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssessment;
