
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

const translations = {
  en: {
    back: "Back",
    createNewAssessment: "Create New Assessment",
    studentName: "Student Name",
    selectStudent: "Select Student",
    assessmentType: "Assessment Type",
    selectType: "Select Type",
    reading: "Reading",
    writing: "Writing",
    comprehension: "Reading Comprehension",
    behavioral: "Behavioral",
    cognitive: "Cognitive",
    date: "Date",
    notes: "Notes",
    addNotes: "Add notes...",
    createAssessment: "Create Assessment",
    home: "Home",
    loadingStudents: "Loading students...",
    externalSystem: "This assessment will be performed in an external system",
    externalSystemExplanation: "You will be redirected to the external system to complete the assessment. After completion, results will be sent back to BrainBridge.",
    startAssessment: "Start Assessment in External System"
  },
  he: {
    back: "חזור",
    createNewAssessment: "יצירת הערכה חדשה",
    studentName: "שם התלמיד",
    selectStudent: "בחר תלמיד",
    assessmentType: "סוג הערכה",
    selectType: "בחר סוג",
    reading: "קריאה",
    writing: "כתיבה",
    comprehension: "הבנת הנקרא",
    behavioral: "התנהגותי",
    cognitive: "קוגניטיבי",
    date: "תאריך",
    notes: "הערות",
    addNotes: "הוסף הערות...",
    createAssessment: "צור הערכה",
    home: "דף הבית",
    loadingStudents: "טוען תלמידים...",
    externalSystem: "אבחון זה יתבצע במערכת חיצונית",
    externalSystemExplanation: "תועבר למערכת החיצונית כדי להשלים את האבחון. לאחר השלמתו, התוצאות יישלחו בחזרה למערכת BrainBridge.",
    startAssessment: "התחל אבחון במערכת חיצונית"
  }
};

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // שליפת רשימת התלמידים
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

  // בדיקה האם האבחון הנבחר מתבצע במערכת חיצונית
  const isExternalAssessment = selectedType === "behavioral" || selectedType === "cognitive" || selectedType === "reading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedType) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תלמיד וסוג אבחון",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isExternalAssessment) {
        // התחלת אבחון במערכת חיצונית
        const assessment = await externalAssessmentService.startExternalAssessment(
          selectedStudent,
          selectedType
        );

        // העברה לדף המסביר על המעבר למערכת החיצונית
        navigate(`/external-assessment/${assessment.id}`);
      } else {
        // לוגיקה ליצירת אבחון רגיל במערכת שלנו
        toast({
          title: "האבחון נוצר",
          description: "האבחון נוצר בהצלחה",
        });
        navigate(`/student/${selectedStudent}`);
      }
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
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
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
              <label className="block text-sm font-medium mb-1">{t.assessmentType}</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
              >
                <option value="">{t.selectType}</option>
                <option value="reading">{t.reading}</option>
                <option value="writing">{t.writing}</option>
                <option value="comprehension">{t.comprehension}</option>
                <option value="behavioral">{t.behavioral}</option>
                <option value="cognitive">{t.cognitive}</option>
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

            {isExternalAssessment && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">{t.externalSystem}</h3>
                <p className="text-blue-700 text-sm mt-2">{t.externalSystemExplanation}</p>
              </div>
            )}

            <Button 
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {isExternalAssessment ? t.startAssessment : t.createAssessment}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssessment;
