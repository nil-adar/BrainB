
import { Sidebar } from "@/components/Sidebar";
import { StudentCard } from "@/components/StudentCard";
import { Settings, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { RotateCcw, Lock, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalogClock } from "@/components/AnalogClock";
import { useNavigate } from "react-router-dom";
import { schoolDataService } from "@/services/mockSchoolData";
import { Student } from "@/types/school";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const translations = {
  en: {
    greeting: "Good morning",
    grade: "4th grade, Leo-Back",
    settings: "Settings",
    logout: "Log out",
    loading: "Loading students data...",
    error: "Error loading students",
    progressMessage: "Viewing progress for student",
    contactMessage: "Opening message dialog for parent"
  },
  he: {
    greeting: "בוקר טוב",
    grade: "כיתה ד׳, ליאו-בק",
    settings: "הגדרות",
    logout: "התנתק",
    loading: "טוען נתוני תלמידים...",
    error: "שגיאה בטעינת נתונים",
    progressMessage: "צופה בהתקדמות של תלמיד",
    contactMessage: "שולח הודעה להורה של"
  }
};

export default function TeacherDashboard() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "he">("he");
  const navigate = useNavigate();
  const t = translations[language];

  const { data: students, isLoading, error } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: schoolDataService.getAllStudents,
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "he" : "en");
  };

  const handleViewProgress = (studentId: string) => {
    toast.info(`${t.progressMessage} ${studentId}`);
    navigate(`/statistics?student=${studentId}`);
  };

  const handleContactParent = (parentId: string) => {
    const student = students?.find(s => s.parentIds.includes(parentId));
    toast.info(`${t.contactMessage} ${student?.firstName || ''}`);
    // In a real app, you would open a messaging dialog or redirect to a messaging page
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 mt-8 md:mt-0 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-gradient-to-br from-secondary/80 to-secondary/40 p-6 shadow-lg">
            <img 
              src="/lovable-uploads/8408577d-8175-422f-aaff-2bc2788f66e3.png" 
              alt="BrainBridge Logo" 
              className="w-80 h-80 md:w-96 md:h-96 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.greeting}, שרה</h1>
            <p className="text-muted-foreground">{t.grade}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <Globe className="w-5 h-5" />
            <span>{language === "en" ? "עברית" : "English"}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>{t.settings}</span>
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:bg-gray-100 rounded-lg">
            {t.logout}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-8">
        {isLoading ? (
          <div className="col-span-full text-center py-8">{t.loading}</div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">{t.error}</div>
        ) : students ? (
          students.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              onViewProgress={handleViewProgress}
              onContactParent={handleContactParent}
            />
          ))
        ) : null}
      </div>
    </div>
  );
}
