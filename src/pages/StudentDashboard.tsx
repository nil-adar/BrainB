import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { translations } from "@/utils/studentDashboardData";


import { SidebarProvider } from "@/components/ui/sidebar";
import { Settings, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import ExternalAssessmentFrame from "@/components/ExternalAssessmentFrame";
import { Logo } from "@/components/ui/logo";
import LanguageSwitcher from "@/components/student/LanguageSwitcher";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import Fireworks from "@/components/student/Fireworks";
import TimerSection from "@/components/student/TimerSection";
import ActionButtons from "@/components/student/ActionButtons";
import TaskListSection from "@/components/student/TaskListSection";
import DashboardBackground from "@/components/student/DashboardBackground";
import DateDisplay from "@/components/student/DateDisplay";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/studentService";
import { Task } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const {
    language,
    showAssessment,
    toggleLanguage,
    handleTaskCompletion,
  
    hasActiveAssessment,
    assessmentToken,
    selectedMood,
    setSelectedMood,
    handleTaskSelect: originalHandleTaskSelect,
  } = useStudentDashboard([]);

const studentId = localStorage.getItem("studentId") ?? "";
const {
  data: student,
  isLoading: isStudentLoading,
  isError: isStudentError,
} = useQuery({
  queryKey: ["student", studentId],
  queryFn: () => studentService.getStudentById(studentId),
  enabled: !!studentId,
});

const today = new Date().toISOString().split("T")[0];
const [hasCompletedToastShown, setHasCompletedToastShown] = useState(false);

const {
  data: tasks = [],
  isLoading,
  isError,
  refetch,
} = useQuery<Task[]>({
  queryKey: ["tasks", studentId, today],
  queryFn: () => {
    console.log("📡 Fetching tasks for:", studentId, today);
    return studentService.getStudentTasks(studentId, today);
  },
  enabled: !!studentId,
});

  const [currentTask, setCurrentTask] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksKey, setFireworksKey] = useState(0);
  const fireworksTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);
  const allowedCategories: string[] = ["red", "green", "orange", "blue", "yellow", "purple"];
  const taskTitle = currentTask?.title || "No task selected";
  const [showHelpModal, setShowHelpModal] = useState(false);
  const handleOpenHelpSupport = () => setShowHelpModal(true);
  const handleCloseHelpSupport = () => setShowHelpModal(false);

  const t = translations[language];

  const progress = tasks.length > 0
    ? (tasks.filter(task => task.completed).length / tasks.length) * 100
    : 0;

 useEffect(() => {
  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
  
  if (allTasksCompleted && !showFireworks && !hasCompletedToastShown) {
    setFireworksKey(prev => prev + 1);
    setShowFireworks(true);
    setHasCompletedToastShown(true); // ✅ פעם אחת בלבד

    toast.success(t.allTasksCompleted || "All tasks completed! Great job!");

    if (fireworksTimerRef.current) clearTimeout(fireworksTimerRef.current);
    fireworksTimerRef.current = setTimeout(() => {
      setShowFireworks(false);
    }, 3000);
  }

  // ניקוי במעבר בין ימים / תלמידים
  if (!allTasksCompleted && hasCompletedToastShown) {
    setHasCompletedToastShown(false);
  }

  return () => {
    if (fireworksTimerRef.current) clearTimeout(fireworksTimerRef.current);
  };
}, [tasks, t, showFireworks, hasCompletedToastShown]);

  const handleTaskSelect = (task: any) => {
    setCurrentTask(task);
    const taskTimeInSeconds =
      task.title === "\u05de\u05e9\u05d7\u05e7 \u05e9\u05de\u05d9\u05e2\u05d4" ? 60 : task.minutes * 60 || task.timeInSeconds || 0;
    setTimeLeft(taskTimeInSeconds);
    setTotalTime(taskTimeInSeconds);
    setShowTimer(true);
    originalHandleTaskSelect(task);
    toast.info(`${t.startTask || "Starting task"}: ${task.title}`);
  };
const handleDeleteTask = async (taskId: string): Promise<void> => {
  if (currentTask?.id === taskId) {
    setCurrentTask(null);
    setTimeLeft(null);
    setShowTimer(false);
  }

  const success = await studentService.deleteTask(taskId);
  if (success) {
    toast.success(t.taskDeleted || "Task deleted successfully");
    refetch(); // עדכון הנתונים מהשרת
  } else {
    toast.error("שגיאה במחיקת משימה");
  }
};


const handleToggleComplete = async (taskId: string): Promise<void> => {

  if (!taskId) {
    console.warn("⚠️ taskId is missing!");
    return;
  }

  try {
    console.log("🔁 Trying to update task:", taskId);

    const updated = await studentService.updateTask(taskId, { completed: true });
    if (updated) {
      toast.success("המשימה עודכנה בהצלחה");
      refetch();
    } else {
      toast.error("שגיאה בעדכון המשימה");
    }
  } catch (err) {
    console.error("❌ Error in handleToggleComplete:", err);
    toast.error("שגיאה כללית בעדכון");
  }
};

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
    if (fireworksTimerRef.current) {
      clearTimeout(fireworksTimerRef.current);
      fireworksTimerRef.current = null;
    }
  }, []);

  const [helpMessage, setHelpMessage] = useState("");

const handleSendHelpMessage = async () => {
  try {
    await fetch("/api/support/contact-teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, message: helpMessage }),
    });
    toast.success("ההודעה נשלחה למורה");
    setHelpMessage("");
    setShowHelpModal(false);
  } catch (err) {
    toast.error("שגיאה בשליחת ההודעה");
  }
};


  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          if (currentTask) {
            toast.info(`Time's up for task: ${currentTask.title}`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [currentTask]);

const navigate = useNavigate();
const handleStartAssessment = () => {
  navigate("/start-assessment"); // או הנתיב המתאים אצלך
};

const handleRedirectToAssessment = () => {
  const studentId = localStorage.getItem("studentId");
  
  if (assessmentToken && studentId) {
    const url = `http://127.0.0.1:8000/?token=${assessmentToken}&studentId=${studentId}`;
    window.open(url, "_blank"); // פותח בטאב חדש
  } else {
    toast.error("     אין אבחון זמין כרגע.אנא פנה למורה שלך  ");
  }
};



const fullName = student ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() : "";
const greeting = language === 'he'
  ? `בוקר טוב${fullName ? `, ${fullName}` : ""}`
  : `Good morning${fullName ? `, ${fullName}` : ""}`;

  console.log("👤 student:", student);
  return (
    <SidebarProvider>
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>עזרה ותמיכה</DialogTitle>
        </DialogHeader>
        <p>כתוב את ההודעה שלך כאן בכל נושא שתבחר  </p>
        <Textarea
          placeholder="מה תרצה לשאול או לשתף?"
          value={helpMessage}
          onChange={(e) => setHelpMessage(e.target.value)}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={handleCloseHelpSupport}>ביטול</Button>
          <Button onClick={handleSendHelpMessage}>שלח</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      <div
        className="min-h-screen flex flex-col w-full bg-background relative overflow-hidden"
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        <DashboardBackground>
          <header className="border-b backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
              <Logo size="xs" showText={false} className="h-10" />
              <h1 className="text-lg font-medium hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {greeting}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={toggleLanguage} />
              <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-blue-100 dark:hover:bg-gray-700">
                <Search size={18} />
              </Button>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-blue-100 dark:hover:bg-gray-700">
                  <Settings size={18} />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-blue-100 dark:hover:bg-gray-700">
                  <LogOut size={18} />
                </Button>
              </Link>
              <Avatar className="h-9 w-9 border-2 border-blue-200 dark:border-gray-600">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="flex-1 p-4 w-full">
            <h1 className="text-2xl font-semibold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {greeting}
            </h1>
            <div className="flex justify-center mb-6">
              <DateDisplay />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_400px] gap-6 max-w-6xl mx-auto">
<ActionButtons
  viewRecommendationsText={t['viewRecommendations']}
  newAssessmentText={t['newAssessment']}
  myAssessmentsText={t['myAssessments']}
  helpSupportText={t['helpSupport']}
  studentFormText={t.fillForm}
  studentId={studentId} //

  onStartAssessment={handleStartAssessment}
  onHelpSupportClick={handleOpenHelpSupport}

  onStudentFormClick={() => navigate(`/student/${studentId}/assessment`)} 
/>


              <TimerSection
                showTimer={showTimer}
                currentTask={currentTask}
                timeLeft={timeLeft}
                totalTime={totalTime}
                progress={progress}
                noTaskMessage={t.noTaskSelected}
                minutesLeftText={t.minutesLeft}
              />
              <TaskListSection
                tasks={tasks}
                currentTask={currentTask}
                tasksTitle={t.tasks}
                todayText={t.today}
                minutesText={t.minutes}
                onToggleComplete={handleToggleComplete}
                onSelectTask={handleTaskSelect}
                onDeleteTask={handleDeleteTask}
                allowedCategories={allowedCategories}
              />
            </div>
          </div>

          <Fireworks
            key={fireworksKey}
            show={showFireworks}
            onComplete={handleFireworksComplete}
            duration={3000}
          />
        </DashboardBackground>
      </div>
    
    </SidebarProvider>
  );
}
