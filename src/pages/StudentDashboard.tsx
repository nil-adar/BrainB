import { format } from "date-fns";
import ExternalAssessmentFrame from "@/components/ExternalAssessmentFrame";
import { MoodSelector } from "@/components/student/MoodSelector";
import { ActionButtons } from "@/components/student/ActionButtons";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentDashboardLayout } from "@/components/student/StudentDashboardLayout";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { translations } from "@/utils/studentDashboardData";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const {
    language,
    tasks,
    showAssessment,
    toggleLanguage,
    handleTaskCompletion,
    handleStartAssessment,
    setShowAssessment,
    hasActiveAssessment,
    assessmentToken 
  } = useStudentDashboard(initialTasks);

  const t = translations[language];
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader 
        language={language} 
        toggleLanguage={toggleLanguage} 
        translations={{ search: t.search }}
      />

      <StudentDashboardLayout
        leftSidebar={
          <>
            <MoodSelector feeling={t.feeling} />
            <ActionButtons 
              viewRecommendations={t.viewRecommendations}
              newAssessment={t.newAssessment}
              myAssessments={t.myAssessments}
              helpSupport={t.helpSupport}
              onStartAssessment={handleStartAssessment}
            />
          </>
        }
        mainContent={
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t.myAssessments}</h2>
            {hasActiveAssessment ? (
              <Button
                onClick={() => window.open(`http://127.0.0.1:8000?token=${assessmentToken}`, "_blank")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                התחל אבחון
              </Button>
            ) : (
              <p className="text-red-500 mt-2">אין אבחון זמין כרגע</p>
            )}
          </div>
        }
        rightSidebar={null}
      />

      <ExternalAssessmentFrame 
        open={showAssessment}
        onClose={() => setShowAssessment(false)}
        url={`http://127.0.0.1:8000?token=${assessmentToken}`}
      />
    </div>
  );
}

const initialTasks = [
  { id: 1, title: "tasksList.task1", duration: "45 minutes", status: "in-progress", stars: 1, color: "bg-primary/10", completed: false, success: false },
  { id: 2, title: "tasksList.task2", duration: "20 minutes", status: "completed", stars: 0, color: "bg-secondary", completed: false, success: false },
  { id: 3, title: "tasksList.task3", duration: "", status: "pending", stars: 2, color: "bg-primary/10", completed: false, success: false },
  { id: 4, title: "tasksList.task4", duration: "10 minutes", status: "pending", stars: 0, color: "bg-secondary/80", completed: false, success: false },
  { id: 5, title: "tasksList.task5", duration: "15 minutes", status: "pending", stars: 0, color: "bg-primary/5", completed: false, success: false },
  { id: 6, title: "tasksList.task6", duration: "10 minutes", status: "pending", stars: 2, color: "bg-secondary/60", completed: false, success: false },
];
