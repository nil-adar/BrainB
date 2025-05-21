
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, MessageCircle, FileSpreadsheet, ChartBar, ClipboardList, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface StudentCardActionsProps {
  studentId: string;
  studentName: string;
  teacherId: string;
  classId: string;   
  translations: {
    createAssessment: string;
    viewPreAssessments: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
    contactParent: string;
    viewProgress: string;
  };
  onContactParent: () => void;
  onViewProgress: () => void;
}

export const StudentCardActions = ({
  studentId,
  studentName,
  translations: t,
  onContactParent,
  onViewProgress,
}: StudentCardActionsProps) => {
  const navigate = useNavigate();
  const [textDirection, setTextDirection] = useState<"text-right" | "text-left">("text-right");

  const teacherId = localStorage.getItem("teacherId");
  const classId = localStorage.getItem("classId");

  useEffect(() => {
    const direction = document.documentElement.dir === "rtl" ? "text-right" : "text-left";
    setTextDirection(direction);
  }, []);

  const handleNavigateToTasks = () => {
    if (!teacherId || !classId) {
      console.warn("❌ חסר teacherId או classId");
      return;
    }
    navigate(`/daily-tasks/${teacherId}/${classId}`);
  };

  return (
    <div className="mt-4 space-y-2">
      <Button 
        variant="secondary" 
        size="sm"
        className={`w-full justify-between ${textDirection} bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-foreground`}
        onClick={() => navigate(`/create-assessment?studentId=${studentId}&studentName=${encodeURIComponent(studentName)}`)}


      >
        <FileSpreadsheet className="w-4 h-4" />
        {t.createAssessment}
      </Button>
      
      <Button 
        variant="secondary"   
        size="sm"
        className={`w-full justify-between ${textDirection} bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-foreground`}
        onClick={() => navigate("/statistics")}
      >
        <ChartBar className="w-4 h-4" />
        {t.viewPreAssessments}
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm"
        className={`w-full justify-between ${textDirection} bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-foreground`}
        onClick={() => navigate(`/daily-tasks/${teacherId}/${classId}`)}

      >
        <ClipboardList className="w-4 h-4" />
        {t.dailyTaskUpdate}
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm"
        className={`w-full justify-between ${textDirection} bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-foreground`}
        onClick={() => navigate(`/student/${studentId}`)}
      >
        <FileText className="w-4 h-4" />
        {t.viewRecommendations}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className={`w-full justify-between ${textDirection}`}
        onClick={onContactParent}
      >
        <MessageCircle className="w-4 h-4" />
        {t.contactParent}
      </Button>
      
      <Button 
        variant="default" 
        size="sm"
        className={`w-full justify-between ${textDirection} bg-teal-500 hover:bg-teal-600`}
        onClick={onViewProgress}
      >
        <BarChart className="w-4 h-4" />
        {t.viewProgress}
      </Button>
    </div>
  );
};
