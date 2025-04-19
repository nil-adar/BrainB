import { format } from "date-fns";
import ExternalAssessmentFrame from "@/components/ExternalAssessmentFrame";
import { MoodSelector } from "@/components/student/MoodSelector";
import { ActionButtons } from "@/components/student/ActionButtons";
import { StudentHeader } from "@/components/student/StudentHeader";
import { StudentDashboardLayout } from "@/components/student/StudentDashboardLayout";
import { useStudentDashboard } from "@/hooks/useStudentDashboard";
import { translations } from "@/utils/studentDashboardData";

export default function StudentDashboard() {
    const {
        language,
        tasks,
        showAssessment,
        toggleLanguage,
        handleTaskCompletion,
        handleStartAssessment,
        setShowAssessment
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
                    <div>
                        {/* התוכן הראשי שלך כאן. ייתכן שתצטרך להעביר לכאן חלק מהתכנים המקוריים */}
                    </div>
                }
                rightSidebar={null} // הסרנו את מערכת השעות
            />

            <ExternalAssessmentFrame 
                open={showAssessment}
                onClose={() => setShowAssessment(false)}
                url="https://nodus.onrender.com/"
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