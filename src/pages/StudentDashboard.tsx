
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { translations, colorfulTasks } from "@/utils/studentDashboardData";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Settings, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import ExternalAssessmentFrame from "@/components/ExternalAssessmentFrame";
import { Logo } from "@/components/ui/logo";
import HourglassTimer from "@/components/student/HourglassTimer";
import Clock from "@/components/student/Clock";
import ProgressBar from "@/components/student/ProgressBar";
import ThemeToggle from "@/components/student/ThemeToggle";
import LanguageSwitcher from "@/components/student/LanguageSwitcher";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import TaskItem from "@/components/student/TaskItem";
import Fireworks from "@/components/student/Fireworks";

export default function StudentDashboard() {
  const {
    language,
    tasks: initialTasks,
    showAssessment,
    toggleLanguage,
    handleTaskCompletion,
    handleStartAssessment,
    setShowAssessment,
    hasActiveAssessment,
    assessmentToken,
    selectedMood,
    setSelectedMood,
  
    currentTask: initialCurrentTask,
    timeLeft: initialTimeLeft,

    handleTaskSelect: originalHandleTaskSelect,
    calculateProgress
  } = useStudentDashboard([]); // ריק משימות התחלתיות, שימוש ב-colorfulTasks במקום

  // ניהול מקומי של משימות כדי שנוכל למחוק אותן
  const [tasks, setTasks] = useState(colorfulTasks);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksKey, setFireworksKey] = useState(0); // Key to force re-render
  const fireworksTimerRef = useRef<NodeJS.Timeout | null>(null);
  const allowedCategories = ["red", "green", "orange", "blue", "yellow", "purple"] as const;
type Category = typeof allowedCategories[number];

  const t = translations[language];
  
  // חישוב התקדמות ובדיקה אם כל המשימות הושלמו
  const progress = tasks.length > 0 
    ? (tasks.filter(task => task.completed).length / tasks.length) * 100 
    : 0;
  
  // בדיקה משופרת להשלמת משימות עם חגיגה בולטת יותר
  useEffect(() => {
    const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
    
    if (allTasksCompleted && !showFireworks) {
      console.log("All tasks completed - showing fireworks");
      setFireworksKey(prev => prev + 1); // Create a new instance
      setShowFireworks(true);
      
      // Display a congratulatory toast
      toast.success(t.allTasksCompleted || "All tasks completed! Great job!");
      
      // Safety timeout to ensure fireworks are removed after 3 seconds
      if (fireworksTimerRef.current) {
        clearTimeout(fireworksTimerRef.current);
      }
      
      fireworksTimerRef.current = setTimeout(() => {
        console.log("Auto-hiding fireworks after timeout");
        setShowFireworks(false);
      }, 3000);
    }
    
    // Clean up timeout on unmount
    return () => {
      if (fireworksTimerRef.current) {
        clearTimeout(fireworksTimerRef.current);
      }
    };
  }, [tasks, t, showFireworks]); 
  const [totalTime, setTotalTime] = useState<number>(0);
  const handleTaskSelect = (task: any) => {
    setCurrentTask(task);
    console.log("Selected task:", task.title);
    console.log("Initial timeLeft set to:", task.title === "משחק שמיעה" ? 60 : task.minutes * 60);

    // Set exact time based on task name - specifically for "משחק שמיעה" (1 minute)
   const taskTimeInSeconds =
  task.title === "משחק שמיעה"
    ? 60
    : task.minutes * 60 || task.timeInSeconds || 0;

setTimeLeft(taskTimeInSeconds);
setTotalTime(taskTimeInSeconds); //

    
    setShowTimer(true);
    originalHandleTaskSelect(task);
    
    // Display a toast notification that the task has started
    toast.info(`${t.startTask || "Starting task"}: ${task.title}`);
  };

  const handleDeleteTask = (taskId: number) => {
    // אם המשימה שנמחקה היא המשימה הנוכחית, נקה את המשימה הנוכחית
    if (currentTask?.id === taskId) {
      setCurrentTask(null);
      setTimeLeft(null);
      setShowTimer(false);
    }
    
    // הסר את המשימה מהרשימה
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success(t.taskDeleted || "Task deleted successfully");
  };

  const handleToggleComplete = (taskId: number) => {
    // Update task completion status
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
  };
  
  // Guaranteed fireworks cleanup
  const handleFireworksComplete = useCallback(() => {
    console.log("Fireworks complete - hiding");
    setShowFireworks(false);
    if (fireworksTimerRef.current) {
      clearTimeout(fireworksTimerRef.current);
      fireworksTimerRef.current = null;
    }
  }, []);

  // ספירה לאחור
useEffect(() => {
  if (timeLeft === null || timeLeft <= 0) return;

  console.log("⏳ Starting timer with timeLeft:", timeLeft); // בדיקה

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev === null || prev <= 0) {
        clearInterval(timer);
        console.log("⏹️ Timer ended");
        if (currentTask) {
          toast.info(`Time's up for task: ${currentTask.title}`);
        }
        return 0;
      }
      console.log("⏰ Decreasing timeLeft:", prev - 1);
      return prev - 1;
    });
  }, 1000);

  return () => {
    console.log("🧹 Clearing timer");
    clearInterval(timer);
  };
}, [currentTask]); // ✅ תלות רק במשימה הנבחרת


  return (
    <SidebarProvider>
      <div 
        className="min-h-screen flex flex-col w-full bg-background relative overflow-hidden" 
        dir={language === 'he' ? 'rtl' : 'ltr'}
      >
        {/* Beautiful background with gradient and pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjZmQ4ZTQiPjwvcmVjdD4KPC9zdmc+')] opacity-20 dark:opacity-10"></div>
        </div>

        {/* כותרת עליונה עם כל הפקדים */}
        <header className="border-b backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <Logo size="xs" showText={false} className="h-10" />
            <h1 className="text-lg font-medium hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'he' ? 'בוקר טוב, רוני' : 'Good morning, Roni'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={(lang) => {
                toggleLanguage();
              }} 
            />
            
           
            
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

        {/* תוכן ראשי */}
        <div className="flex-1 p-4 w-full">
          <h1 className="text-2xl font-semibold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {language === 'he' ? 'בוקר טוב, רוני' : 'Good morning, Roni'}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_400px] gap-6 max-w-6xl mx-auto">
            {/* עמודה שמאלית - כפתורי פעולה */}
            <div className="flex flex-col items-center md:items-start gap-3 order-3 md:order-1">
              <Link to="/recommendations" className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:from-blue-900 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-700 text-blue-700 dark:text-blue-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm">
                {t.viewRecommendations}
              </Link>
              <Button 
                className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md"
                onClick={handleStartAssessment}
              >
                {t.newAssessment}
              </Button>
              <Link to="/my-assessments" className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 dark:from-green-900 dark:to-green-800 dark:hover:from-green-800 dark:hover:to-green-700 text-green-700 dark:text-green-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm">
                {t.myAssessments || "My Assessments"}
              </Link>
              <Link to="/help-support" className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 dark:from-amber-900 dark:to-amber-800 dark:hover:from-amber-800 dark:hover:to-amber-700 text-amber-700 dark:text-amber-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm">
                {t.helpSupport || "Help & Support"}
              </Link>
            </div>

            {/* עמודה אמצעית - שעון והתקדמות - עכשיו קטן יותר */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg border border-blue-100 dark:border-gray-700 shadow-md p-4 h-[250px] flex flex-col items-center order-1 md:order-2">
              <div className="flex-1 w-full mb-2 scale-75">
                {!showTimer && <Clock currentTask={currentTask} />}
              </div>
              <div className={`flex-1 w-full ${!showTimer && 'hidden'}`}>
                <HourglassTimer 
                  timeLeft={timeLeft} 
                
                  totalTime={totalTime} 
                  taskTitle={currentTask?.title}
                  noTaskMessage={t.noTaskSelected}
                  minutesLeftText={t.minutesLeft}
                  showTimeText={false} // לא מציג מספרים כדי לא להלחיץ את הילד
                  timerColor="#8B5CF6" // Consistent purple color for timer
                />
              </div>
              <div className="w-full mt-auto">
                <ProgressBar progress={progress} />
              </div>
            </div>
            
            {/* עמודה ימנית - רשימת משימות - עכשיו גדולה יותר */}
            <div className="flex flex-col justify-self-end order-2 md:order-3 w-full">
              <div className="mb-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800/80 dark:to-purple-900/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                <h2 className="text-xl font-medium text-blue-800 dark:text-blue-300">{t.tasks}</h2>
                <span className="text-sm font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-purple-600 dark:text-purple-300">{t.today}</span>
              </div>
              
              <div className="overflow-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    timeEstimation={`${task.minutes} ${t.minutes}`}
                    color={task.color}
                    stars={task.stars}
                    completed={task.completed}
                    onToggleComplete={handleToggleComplete}
                    onSelect={() => handleTaskSelect(task)}
                    onDelete={handleDeleteTask}
                    isSelected={currentTask?.id === task.id}
                     category={
  allowedCategories.includes(task.category as Category)
    ? (task.category as Category)
    : "blue"
}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* חגיגת זיקוקים - עכשיו משך קצר יותר וניתן ללחיצה */}
        <Fireworks 
          key={fireworksKey}
          show={showFireworks} 
          onComplete={handleFireworksComplete}
          duration={3000} // Exactly 3 seconds (3000ms)
        />
      </div>
      
      {/* מסגרת הערכה חיצונית */}
      <ExternalAssessmentFrame 
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        url={`http://127.0.0.1:8000?token=${assessmentToken}`}
      />
    </SidebarProvider>
  );
}