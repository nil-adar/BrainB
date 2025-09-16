import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  MessageCircle,
  FileSpreadsheet,
  ChartBar,
  ClipboardList,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";

interface StudentCardActionsProps {
  studentId: string;
  studentName: string;
  teacherId: string;
  classId: string;
  translations: {
    createAssessment: string;
    //viewPreAssessments: string;
    dailyTaskUpdate: string;
    viewRecommendations: string;
    contactParent: string;
    //viewProgress: string;
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
  const [textDirection, setTextDirection] = useState<
    "text-right" | "text-left"
  >("text-right");

  const teacherId = localStorage.getItem("teacherId");
  const classId = localStorage.getItem("classId");

  useEffect(() => {
    const direction =
      document.documentElement.dir === "rtl" ? "text-right" : "text-left";
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
    <div className="mt-4 space-y-2 ">
      <Button
        variant="secondary"
        className={`w-full justify-between ${textDirection} bg-sky-100 hover:bg-sky-200 text-foreground`}
        onClick={() =>
          navigate(
            `/create-assessment?studentId=${studentId}&studentName=${encodeURIComponent(
              studentName
            )}`
          )
        }
      >
        <FileSpreadsheet className="w-4 h-4" />
        {t.createAssessment}
      </Button>

      <Button
        variant="secondary"
        className={`w-full justify-between ${textDirection} bg-sky-100 hover:bg-sky-200 text-foreground`}
        onClick={() => navigate(`/daily-tasks/${teacherId}/${classId}`)}
      >
        <ClipboardList className="w-4 h-4" />
        {t.dailyTaskUpdate}
      </Button>

      <Button
        variant="secondary"
        className={`w-full justify-between ${textDirection} bg-sky-100 hover:bg-sky-200 text-foreground`}
        onClick={() => navigate(`/recommendations?studentId=${studentId}`)}
      >
        <FileText className="w-4 h-4" />
        {t.viewRecommendations}
      </Button>

      <Button
        variant="outline"
        className={`w-full justify-between bg-sky-100 hover:bg-sky-200 text-foreground ${textDirection}`}
        onClick={onContactParent}
      >
        <MessageCircle className="w-4 h-4" />
        {t.contactParent}
      </Button>
    </div>
  );
};
