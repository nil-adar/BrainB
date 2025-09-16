import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { externalAssessmentService } from "@/services/externalAssessmentService";
import { Assessment, Student } from "@/types/school";
import { useToast } from "@/hooks/use-toast";
import { studentService } from "@/services/studentService";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

/**
 * ExternalAssessment.tsx
 *
 * Component for managing the external assessment process:
 * - Loads assessment and student data by ID
 * - Displays current status (loading, ready, in progress, completed, error)
 * - Redirects to external assessment system
 * - Simulates result retrieval and updates UI accordingly
 *
 * Localization: Supports both English and Hebrew based on document direction
 * Dependencies: externalAssessmentService, studentService, React Router, Lucide icons, ShadCN UI
 */

const translations = {
  en: {
    back: "Back",
    loading: "Loading assessment details...",
    title: "External Assessment System",
    subtitle:
      "You are about to be redirected to the external assessment system",
    readyToStart:
      "When you're ready, click the button below to start the assessment",
    startAssessment: "Start Assessment",
    assessmentInProgress: "Assessment in progress",
    waitingForResults: "Waiting for assessment results...",
    assessmentCompleted: "Assessment completed",
    viewResults: "View Results",
    returnToDashboard: "Return to Dashboard",
    errorLoadingAssessment: "Error loading assessment",
    student: "Student",
    assessmentType: "Assessment Type",
    startDate: "Start Date",
    assessmentId: "Assessment ID",
    errorNoAssessment: "Assessment not found",
  },
  he: {
    back: "חזור",
    loading: "טוען פרטי אבחון...",
    title: "מערכת אבחון חיצונית",
    subtitle: "אתה עומד להיות מופנה למערכת אבחון חיצונית",
    readyToStart: "כשאתה מוכן, לחץ על הכפתור למטה כדי להתחיל את האבחון",
    startAssessment: "התחל אבחון",
    assessmentInProgress: "האבחון בתהליך",
    waitingForResults: "ממתין לתוצאות האבחון...",
    assessmentCompleted: "האבחון הושלם",
    viewResults: "צפה בתוצאות",
    returnToDashboard: "חזור לדף הבית",
    errorLoadingAssessment: "שגיאה בטעינת האבחון",
    student: "תלמיד",
    assessmentType: "סוג אבחון",
    startDate: "תאריך התחלה",
    assessmentId: "מזהה אבחון",
    errorNoAssessment: "האבחון לא נמצא",
  },
};

const assessmentTypeNames = {
  reading: { en: "Reading Assessment", he: "אבחון קריאה" },
  behavioral: { en: "Behavioral Assessment", he: "אבחון התנהגותי" },
  cognitive: { en: "Cognitive Assessment", he: "אבחון קוגניטיבי" },
};

const ExternalAssessment = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "loading" | "ready" | "in_progress" | "completed" | "error"
  >("loading");
  const [resultsReceived, setResultsReceived] = useState<boolean>(false);

  useEffect(() => {
    if (!assessmentId) {
      setStatus("error");
      return;
    }

    const loadAssessmentData = async () => {
      try {
        setIsLoading(true);
        const assessmentData =
          await externalAssessmentService.getAssessmentStatus(assessmentId);

        if (!assessmentData) {
          toast({
            title: "שגיאה",
            description: t.errorNoAssessment,
            variant: "destructive",
          });
          setStatus("error");
          return;
        }

        setAssessment(assessmentData);

        const studentData = await studentService.getStudent(
          assessmentData.studentId
        );
        setStudent(studentData || null);

        if (
          assessmentData.status === "completed" ||
          assessmentData.status === "evaluated"
        ) {
          setStatus("completed");
          setResultsReceived(true);
        } else if (assessmentData.status === "in_progress") {
          setStatus("in_progress");
        } else {
          setStatus("ready");
        }
      } catch (error) {
        console.error("Error loading assessment data:", error);
        toast({
          title: "שגיאה",
          description: t.errorLoadingAssessment,
          variant: "destructive",
        });
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [assessmentId, toast, t]);

  const handleStartAssessment = () => {
    if (!assessment || !assessment.externalSystemUrl) return;

    setIsRedirecting(true);

    window.open(assessment.externalSystemUrl, "_blank");

    setStatus("in_progress");
    setIsRedirecting(false);
    simulateExternalSystemCompletion();
  };

  const simulateExternalSystemCompletion = () => {
    if (!assessment) return;

    const timer = setTimeout(async () => {
      try {
        if (assessment.externalSystemId) {
          const results =
            await externalAssessmentService.receiveExternalResults(
              assessment.externalSystemId
            );
          if (results) {
            const updatedAssessment =
              await externalAssessmentService.getAssessmentStatus(
                assessmentId!
              );
            if (updatedAssessment) {
              setAssessment(updatedAssessment);
              setStatus("completed");
              setResultsReceived(true);

              toast({
                title: "האבחון הושלם",
                description: `תוצאות האבחון מסוג ${assessment.type} התקבלו`,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error receiving assessment results:", error);
      }
    }, 10000); 

    return () => clearTimeout(timer);
  };

  const handleViewResults = () => {
    if (!assessment) return;
    navigate(`/assessment-results/${assessment.id}`);
  };

  const handleReturnToDashboard = () => {
    navigate("/");
  };

  const renderAssessmentDetails = () => {
    if (!assessment || !student) return null;

    const typeName =
      assessmentTypeNames[
        assessment.type as keyof typeof assessmentTypeNames
      ]?.[language] || assessment.type;
    const startDate = assessment.startedAt
      ? new Date(assessment.startedAt).toLocaleDateString()
      : "-";

    return (
      <div className="space-y-3 mt-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{t.student}</div>
            <div className="font-medium">{student.name}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{t.assessmentType}</div>
            <div className="font-medium">{typeName}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{t.startDate}</div>
            <div className="font-medium">{startDate}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">{t.assessmentId}</div>
            <div className="font-medium text-xs truncate">{assessment.id}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <Card className="p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p>{t.loading}</p>
            </div>
          </Card>
        ) : status === "error" ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">
              {t.errorLoadingAssessment}
            </h2>
            <Button onClick={handleReturnToDashboard}>
              {t.returnToDashboard}
            </Button>
          </Card>
        ) : (
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-2">{t.title}</h1>

            {status === "ready" && (
              <>
                <p className="text-gray-600 mb-4">{t.subtitle}</p>
                {renderAssessmentDetails()}
                <div className="mt-6 text-center">
                  <p className="mb-4">{t.readyToStart}</p>
                  <Button
                    onClick={handleStartAssessment}
                    className="bg-primary hover:bg-primary/90"
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    {t.startAssessment}
                  </Button>
                </div>
              </>
            )}

            {status === "in_progress" && (
              <>
                <p className="text-gray-600 mb-4">{t.assessmentInProgress}</p>
                {renderAssessmentDetails()}
                <div className="mt-6 flex items-center justify-center flex-col">
                  <Loader2 className="h-10 w-10 animate-spin mb-4" />
                  <p>{t.waitingForResults}</p>
                </div>
              </>
            )}

            {status === "completed" && (
              <>
                <p className="text-green-600 font-semibold mb-4">
                  {t.assessmentCompleted}
                </p>
                {renderAssessmentDetails()}
                <div className="mt-6 space-y-4">
                  <Button
                    onClick={handleViewResults}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {t.viewResults}
                  </Button>
                  <Button
                    onClick={handleReturnToDashboard}
                    variant="outline"
                    className="w-full"
                  >
                    {t.returnToDashboard}
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExternalAssessment;
