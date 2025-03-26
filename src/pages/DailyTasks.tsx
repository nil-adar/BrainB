
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const translations = {
  en: {
    back: "Back",
    updateDailyTasks: "Update Daily Tasks",
    student: "Student",
    selectStudent: "Select Student",
    date: "Date",
    tasks: "Tasks",
    readingText: "Reading Text",
    practiceComprehension: "Practice Comprehension",
    notStarted: "Not Started",
    inProgress: "In Progress",
    completed: "Completed",
    notes: "Notes...",
    saveChanges: "Save Changes",
    home: "Home"
  },
  he: {
    back: "חזור",
    updateDailyTasks: "עדכון משימות יומיות",
    student: "תלמיד",
    selectStudent: "בחר תלמיד",
    date: "תאריך",
    tasks: "משימות",
    readingText: "קריאת טקסט",
    practiceComprehension: "תרגול הבנת הנקרא",
    notStarted: "טרם התחיל",
    inProgress: "בתהליך",
    completed: "הושלם",
    notes: "הערות...",
    saveChanges: "שמור שינויים",
    home: "דף הבית"
  }
};

const DailyTasks = () => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: "מיה פרץ", href: "/student/123" },
    { label: t.tasks },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.updateDailyTasks}</h1>
        
        <Card className="p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">{t.student}</label>
              <select className="w-full p-2 border rounded-lg">
                <option value="">{t.selectStudent}</option>
                <option value="1">אליאנה כהן</option>
                <option value="2">נח לוי</option>
                <option value="3">מיה פרץ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.date}</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{t.tasks}</h2>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{t.readingText}</span>
                  <select className="p-2 border rounded-lg">
                    <option value="not_started">{t.notStarted}</option>
                    <option value="in_progress">{t.inProgress}</option>
                    <option value="completed">{t.completed}</option>
                  </select>
                </div>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder={t.notes}
                />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{t.practiceComprehension}</span>
                  <select className="p-2 border rounded-lg">
                    <option value="not_started">{t.notStarted}</option>
                    <option value="in_progress">{t.inProgress}</option>
                    <option value="completed">{t.completed}</option>
                  </select>
                </div>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  placeholder={t.notes}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t.saveChanges}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DailyTasks;
