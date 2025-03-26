import { useState } from "react";
import { Bell, Globe, Settings, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import ExternalAssessmentFrame from "@/components/ExternalAssessmentFrame";
import { toast } from "@/hooks/use-toast";
import { MoodSelector } from "@/components/student/MoodSelector";
import { ActionButtons } from "@/components/student/ActionButtons";
import { TasksList } from "@/components/student/TasksList";
import { ScheduleList } from "@/components/student/ScheduleList";
import { Logo } from "@/components/ui/logo";

const initialTasks = [
  { id: 1, title: "tasksList.task1", duration: "45 minutes", status: "in-progress", stars: 1, color: "bg-primary/10", completed: false, success: false },
  { id: 2, title: "tasksList.task2", duration: "20 minutes", status: "completed", stars: 0, color: "bg-secondary", completed: false, success: false },
  { id: 3, title: "tasksList.task3", duration: "", status: "pending", stars: 2, color: "bg-primary/10", completed: false, success: false },
  { id: 4, title: "tasksList.task4", duration: "10 minutes", status: "pending", stars: 0, color: "bg-secondary/80", completed: false, success: false },
  { id: 5, title: "tasksList.task5", duration: "15 minutes", status: "pending", stars: 0, color: "bg-primary/5", completed: false, success: false },
  { id: 6, title: "tasksList.task6", duration: "10 minutes", status: "pending", stars: 2, color: "bg-secondary/60", completed: false, success: false },
];

const translations = {
  en: {
    currentTask: "Current Task",
    tasks: "Tasks",
    viewRecommendations: "View recommendations",
    newAssessment: "Do a new assessment",
    myAssessments: "My assessments",
    helpSupport: "Help/support",
    feeling: "How am I feeling today?",
    search: "Search",
    tasksList: {
      task1: "math homework Q1,2,3,4,8",
      task2: "Read & summarize a chapter from the book you are reading",
      task3: "Draw or paint a picture of your favorite scene from the book you are reading",
      task4: "Enjoy a healthy snack and hydrate",
      task5: "Watch a fun educational video related to this week's science topic",
      task6: "Write down three interesting facts you learned"
    }
  },
  he: {
    currentTask: "משימה נוכחית",
    tasks: "משימות",
    viewRecommendations: "צפה בהמלצות",
    newAssessment: "בצע הערכה חדשה",
    myAssessments: "ההערכות שלי",
    helpSupport: "עזרה ותמיכה",
    feeling: "איך אני מרגיש היום?",
    search: "חיפוש",
    tasksList: {
      task1: "שיעורי בית במתמטיקה שאלות 1,2,3,4,8",
      task2: "קרא וסכם פרק מהספר שאתה קורא",
      task3: "צייר או צבע תמונה של הסצנה האהובה עליך מהספר שאתה קורא",
      task4: "תהנה מחטיף בריא ושתה מים",
      task5: "צפה בסרטון חינוכי מהנה הקשור לנושא המדע של השבוע",
      task6: "כתוב שלוש עובדות מעניינות שלמדת"
    }
  }
};

interface ScheduleItem {
  time: string;
  subject: string;
  chapter: string;
  room: string;
  teacher: string;
}

const scheduleItems: ScheduleItem[] = [
  {
    time: "11:35",
    subject: "Mathematics",
    chapter: "Chapter 1: Introduction",
    room: "Room S-205",
    teacher: "Benjamin Wilkerson"
  },
  {
    time: "13:15",
    subject: "Biology",
    chapter: "Chapter 3: Animal Kingdom",
    room: "Room S-305",
    teacher: "Julie Watson"
  },
  {
    time: "15:10",
    subject: "Geography",
    chapter: "Chapter 2: Knowing USA",
    room: "Room H-403",
    teacher: "Jenny Alexander"
  }
];

export default function StudentDashboard() {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const [tasks, setTasks] = useState(initialTasks);
  const [showAssessment, setShowAssessment] = useState(false);
  const t = translations[language];
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");

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

  const getTaskTitle = (taskKey: string) => {
    const keys = taskKey.split('.');
    return t[keys[0]][keys[1]];
  };
  
  const handleStartAssessment = () => {
    toast({
      title: "פתיחת מערכת אבחון",
      description: "מערכת האבחון החיצונית נפתחת...",
    });
    setShowAssessment(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo size="md" />
              <div className="relative flex items-center">
                <Input
                  type="search"
                  placeholder={language === "en" ? "Search" : "חיפוש"}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{currentDate}</span>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <Globe className="w-5 h-5" />
                <span>{language === "en" ? "עברית" : "English"}</span>
              </button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr,300px] gap-8">
          <aside className="space-y-6">
            <MoodSelector feeling={t.feeling} />
            <ActionButtons 
              viewRecommendations={t.viewRecommendations}
              newAssessment={t.newAssessment}
              myAssessments={t.myAssessments}
              helpSupport={t.helpSupport}
              onStartAssessment={handleStartAssessment}
            />
          </aside>

          <section>
            <TasksList 
              tasks={tasks}
              tasksLabel={t.tasks}
              currentTaskLabel={t.currentTask}
              getTaskTitle={getTaskTitle}
              onTaskCompletion={handleTaskCompletion}
            />
          </section>

          <aside className="space-y-6">
            <ScheduleList scheduleItems={scheduleItems} />
          </aside>
        </div>
      </div>
      
      <ExternalAssessmentFrame 
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        url="https://nodus.onrender.com/"
      />
    </div>
  );
}
