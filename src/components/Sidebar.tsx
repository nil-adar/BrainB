
import { BarChart2, BookOpen, HelpCircle, Scale, Settings } from "lucide-react";

const translations = {
  en: {
    brainbridge: "BrainBridge",
    chooseSchool: "Choose a School/Class",
    updateTasks: "Update daily tasks",
    viewStats: "View Statistics",
    help: "Help/Support",
    legal: "Legal Terms",
  },
  he: {
    brainbridge: "בריינברידג׳",
    chooseSchool: "בחר בית ספר/כיתה",
    updateTasks: "עדכון משימות יומיות",
    viewStats: "צפה בסטטיסטיקות",
    help: "עזרה ותמיכה",
    legal: "תנאים משפטיים",
  }
};

export const Sidebar = () => {
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  return (
    <div className="w-full md:w-64 bg-white border-r h-full p-4 flex flex-col">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-primary">{t.brainbridge}</h1>
      </div>
      
      <div className="space-y-1 md:space-y-2">
        <button className="w-full flex items-center gap-2 px-3 md:px-4 py-2 text-left hover:bg-secondary rounded-lg text-sm md:text-base">
          <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t.chooseSchool}</span>
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 md:px-4 py-2 text-left hover:bg-secondary rounded-lg text-sm md:text-base">
          <Settings className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t.updateTasks}</span>
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 md:px-4 py-2 text-left hover:bg-secondary rounded-lg text-sm md:text-base">
          <BarChart2 className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t.viewStats}</span>
        </button>
      </div>

      <div className="mt-auto space-y-1 md:space-y-2">
        <button className="w-full flex items-center gap-2 px-3 md:px-4 py-2 text-left hover:bg-secondary rounded-lg text-sm md:text-base">
          <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t.help}</span>
        </button>
        
        <button className="w-full flex items-center gap-2 px-3 md:px-4 py-2 text-left hover:bg-secondary rounded-lg text-sm md:text-base">
          <Scale className="w-4 h-4 md:w-5 md:h-5" />
          <span>{t.legal}</span>
        </button>
      </div>
    </div>
  );
};
