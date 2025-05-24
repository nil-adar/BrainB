

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: string;
  title: string;
  duration: string;
  durationInSeconds: number;
  status: string;
  stars: number;
  color: string;
  completed: boolean;
  success: boolean;
}


export const useStudentDashboard = (initialTasks: Task[]) => {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const [tasks, setTasks] = useState(initialTasks);
  const [showAssessment, setShowAssessment] = useState(false);
  const [hasActiveAssessment, setHasActiveAssessment] = useState(false);
  const [assessmentToken, setAssessmentToken] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null); // ✅ נוסף כאן
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const totalTime = currentTask?.durationInSeconds ?? 0;


  const handleTaskSelect = (task: Task) => {
  setCurrentTask(task);
  if (task.title === "משחק שמיעה") {
    setTimeLeft(60); // 1 דקה קבועה
  } else {
    setTimeLeft(task.durationInSeconds || null);
  }
};

const calculateProgress = () => {
  if (!tasks || tasks.length === 0) return 0;
  return (tasks.filter(t => t.completed).length / tasks.length) * 100;
};


useEffect(() => {
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");
  

  if (!studentId || !token) return;

  axios
    .get(`/api/diagnostic/has-active/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      console.log("🎫 טוקן אבחון שהתקבל:", res.data.sessionToken);

      if (res.data.valid && res.data.sessionToken) {
        setHasActiveAssessment(true);
        setAssessmentToken(res.data.sessionToken); // ת 
      } else {
        setHasActiveAssessment(false);
        setAssessmentToken(null);
      }
    })
    .catch((err) => {
      console.error("שגיאה בבדיקת אבחון זמין:", err);
      setHasActiveAssessment(false);
      setAssessmentToken(null);
    });
}, []);


  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "he" : "en"));
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
  };

  const handleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleStartAssessment = () => {
    if (!assessmentToken) {
      toast({ title: "אין אבחון זמין", variant: "destructive" });
      return;
    }

    toast({
      title: "פתיחת מערכת אבחון",
      description: "מערכת האבחון החיצונית נפתחת...",
    });
    setShowAssessment(true);
  };
return {
  language,
  tasks,
  showAssessment,
  toggleLanguage,
  handleTaskCompletion,
  handleStartAssessment,
  setShowAssessment,
  hasActiveAssessment,
  assessmentToken, 
  selectedMood,
  setSelectedMood,
  timeLeft,
  setTimeLeft,
  currentTask,
  setCurrentTask,
  handleTaskSelect,
  calculateProgress,
  totalTime,
};

};
