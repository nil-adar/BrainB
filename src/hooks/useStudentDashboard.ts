
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "he" : "en");
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
  };

  const handleTaskCompletion = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleStartAssessment = () => {
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
    setShowAssessment
  };
};
