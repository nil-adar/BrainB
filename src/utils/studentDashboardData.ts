import { QrCode } from "lucide-react";

export const translations = {
  en: {
    currentTask: "Current Task",
    tasks: "Tasks",
    startTask: "Starting task",
    minutesLeft: "Minutes left",
    taskDeleted: "Task deleted successfully",
    allTasksCompleted: "All tasks completed! Great job!",
    today: "Today",
    howAreYouFeeling: "How are you feeling today?",
    viewRecommendations: "View recommendations",
    newAssessment: "Do a new assessment",
    myAssessments: "My assessments",
    helpSupport: "Help/support",
    feeling: "How am I feeling today?",
    noTaskSelected: "Please select a task first",
    search: "Search",
    minutes: "minutes",
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
    allTasksCompleted: "כל המשימות הושלמו! כל הכבוד!",
    viewRecommendations: "צפה בהמלצות",
    today: "היום",
    taskDeleted: "המשימה נמחקה בהצלחה",
    alday: "היום",
    howAreYouFeeling: "איך אתה מרגיש היום?",
    startTask: "מתחיל משימה",
    noTaskSelected: "אנא בחר משימה",
    minutesLeft: "דקות נותרו",
    minutes: "דקות",
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

export interface ScheduleItem {
  time: string;
  subject: string;
  chapter: string;
  room: string;
  teacher: string;
}

export const scheduleItems: ScheduleItem[] = [
 

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
export const colorfulTasks = [
  {
    id: 1,
    title: "משחק שמיעה",
    minutes: 1,
    color: "#FBBF24", // yellow
    completed: false,
    stars: 2,
     category: "listening"
  },
  {
    id: 2,
    title: "סיכום פרק",
    minutes: 3,
    color: "#60A5FA", // blue
    completed: false,
    stars: 3,
    category: "listening"
  },
  {
    id: 3,
    title: "תרגול מתמטי",
    minutes: 5,
    color: "#34D399", // green
    completed: false,
    stars: 1,
    category: "listening"
  }
];

