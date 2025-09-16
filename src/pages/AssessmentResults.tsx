import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { externalAssessmentService } from "@/services/externalAssessmentService";
import { Assessment, ExternalAssessmentResult, Student } from "@/types/school";
import { useToast } from "@/hooks/use-toast";
import { studentService } from "@/services/studentService";
import { ArrowLeft, CheckCircle, File, Loader2 } from "lucide-react";

/**
 * AssessmentResults Component
 * ---------------------------------------------
 * Renders a localized, read-only view of an external assessment's results for a given student.
 *
 * Responsibilities:
 * - Fetch assessment by route param `assessmentId`.
 * - Fetch student by `assessment.studentId`.
 * - Parse JSON results payload into a typed `ExternalAssessmentResult`.
 * - Render score, strengths, weaknesses, and recommendations.
 * - Provide UI actions: Back, Download Report (simulated), Return to Dashboard.
 */

const translations = {
  en: {
    back: "Back",
    loading: "Loading assessment results...",
    title: "Assessment Results",
    student: "Student",
    assessmentType: "Assessment Type",
    date: "Assessment Date",
    score: "Score",
    strengths: "Identified Strengths",
    weaknesses: "Areas for Improvement",
    recommendations: "Recommendations",
    downloadReport: "Download Report",
    returnToDashboard: "Return to Dashboard",
    errorLoadingResults: "Error loading assessment results",
  },
  he: {
    back: "חזור",
    loading: "טוען תוצאות אבחון...",
    title: "תוצאות אבחון",
    student: "תלמיד",
    assessmentType: "סוג אבחון",
    date: "תאריך אבחון",
    score: "ציון",
    strengths: "חוזקות שזוהו",
    weaknesses: "תחומים לשיפור",
    recommendations: "המלצות",
    downloadReport: "הורד דוח",
    returnToDashboard: "חזור לדף הבית",
    errorLoadingResults: "שגיאה בטעינת תוצאות האבחון",
  },
};

const assessmentTypeNames = {
  reading: { en: "Reading Assessment", he: "אבחון קריאה" },
  behavioral: { en: "Behavioral Assessment", he: "אבחון התנהגותי" },
  cognitive: { en: "Cognitive Assessment", he: "אבחון קוגניטיבי" },
};

const AssessmentResults = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<ExternalAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!assessmentId) {
      return;
    }

    const loadResults = async () => {
      try {
        setIsLoading(true);
        const assessmentData =
          await externalAssessmentService.getAssessmentStatus(assessmentId);

        if (!assessmentData) {
          toast({
            title: "שגיאה",
            description: "האבחון לא נמצא",
            variant: "destructive",
          });
          return;
        }

        setAssessment(assessmentData);

        const studentData = await studentService.getStudent(
          assessmentData.studentId
        );
        setStudent(studentData || null);

        if (assessmentData.result) {
          try {
            const parsedResults = JSON.parse(
              assessmentData.result
            ) as ExternalAssessmentResult;
            setResults(parsedResults);
          } catch (error) {
            console.error("Error parsing assessment results:", error);
          }
        }
      } catch (error) {
        console.error("Error loading assessment results:", error);
        toast({
          title: "שגיאה",
          description: t.errorLoadingResults,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [assessmentId, toast, t]);

  const handleDownloadReport = () => {
    toast({
      title: "הורדת דוח",
      description: "הדוח יורד בהצלחה",
    });
  };

  const handleReturnToDashboard = () => {
    navigate("/");
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

      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <Card className="p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p>{t.loading}</p>
            </div>
          </Card>
        ) : !assessment || !student || !results ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">
              {t.errorLoadingResults}
            </h2>
            <Button onClick={handleReturnToDashboard}>
              {t.returnToDashboard}
            </Button>
          </Card>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">{t.title}</h1>

            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">{t.student}</div>
                  <div className="font-medium">{student.name}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">
                    {t.assessmentType}
                  </div>
                  <div className="font-medium">
                    {assessmentTypeNames[
                      assessment.type as keyof typeof assessmentTypeNames
                    ]?.[language] || assessment.type}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">{t.date}</div>
                  <div className="font-medium">
                    {assessment.completedAt
                      ? new Date(assessment.completedAt).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6 text-center">
                <div className="text-sm text-blue-700 mb-1">{t.score}</div>
                <div className="text-3xl font-bold text-blue-800">
                  {results.score}/100
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-green-700">
                    {t.strengths}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-green-800">
                    {results.details.strengths.map(
                      (strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-600" />
                          <span>{strength}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-700">
                    {t.weaknesses}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-orange-800">
                    {results.details.weaknesses.map(
                      (weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">
                    {t.recommendations}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    {results.details.recommendations.map(
                      (recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownloadReport}
                className="flex-1"
                variant="outline"
              >
                <File className="mr-2 h-4 w-4" />
                {t.downloadReport}
              </Button>
              <Button
                onClick={handleReturnToDashboard}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {t.returnToDashboard}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssessmentResults;
