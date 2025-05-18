

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  duration: string;
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

  const handleTaskCompletion = (taskId: number) => {
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
    assessmentToken // ⬅️ נחזיר את זה
  };
};
