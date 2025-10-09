import {
  Search,
  Bell,
  UserCircle,
  Users,
  BookOpen,
  Activity,
  AlertCircle,
  CheckCircle,
  FileText,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import RecommendationPdfView from "@/components/RecommendationPdfView";
import { useSettings } from "@/components/SettingsContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { Logo } from "@/components/ui/logo";
import RecommendationTypeSelectionModal from "@/components/RecommendationTypeSelectionModal";
import RecommendationToggle from "@/components/RecommendationToggle";
import { useState, useEffect, useCallback } from "react";
import { getViewerDashboardUrl } from "@/utils/paths";
import { getLocalizedDate } from "@/utils/dateTranslations";
import { useMemo } from "react";
import { getTimeBasedGreeting } from "@/utils/timeGreetings";
import HelpButton from "@/components/HelpButton";

/**
 * Recommendations Page
 * ------------------------------------------------------------
 * Purpose: Displays ADHD recommendations (Nutrition, Physical, Environmental)
 * for a specific student, with localization (EN/HE), RTL handling, and gating
 * behind completion of required forms (student, parent, teacher, diagnosis).
 *
 * Key features:
 * - Persists language in localStorage/sessionStorage and syncs with SettingsContext
 * - Loads current viewer (role/id) from storage or API fallback
 * - Fetches recommendations with an optional user preference (main-only vs both)
 * - If multiple diagnosis types exist, prompts for user preference via modal
 * - Shows a popup with missing-forms status and navigation to the relevant forms
 * - Renders a PDF preview section via `RecommendationPdfView`
 *
 * Security/PII:
 * - Avoid logging sensitive user data; console logs are kept to debug-level and generic
 * - Ensure API endpoints are authenticated (handled outside this component)
 */

const getStoredLanguage = (): "en" | "he" => {
  const stored = localStorage.getItem("language");
  if (stored === "en" || stored === "he") {
    return stored;
  }

  const contextStored = sessionStorage.getItem("currentLanguage");
  if (contextStored === "en" || contextStored === "he") {
    return contextStored;
  }

  return "he";
};

const saveLanguage = (currentLanguage: string) => {
  localStorage.setItem("language", currentLanguage);
  sessionStorage.setItem("currentLanguage", currentLanguage);
};

interface RecommendationResponseData {
  recommendations: any[];
  mainType?: string;
  multipleTypes?: boolean;
  subTypes?: string[];
  answersByTag?: any[];
  professionalSupport?: boolean;
  selectedTags?: string[];
  allergyList?: string[];
  recommendationTypesList?: string[];
  message?: string;
  noAdhd?: boolean;
}

const translations = {
  en: {
    title: "Recommendations",
    nutritionalAdvice: "Nutritional Advice",
    physicalActivity: "Physical Activity Suggestions",
    environmentalModifications: "Environmental Modifications",
    formalRecommendations: "Formal recommendations file:",
    greeting: "Good morning",
    viewRecommendations: "View recommendations",
    noRecommendations: "No recommendations found.",
    home: "Home",
    guideTitle: "ADHD Recommendations Guide",
    guideSubtitle:
      "Evidence-based recommendations for children with attention and focus disorders",
    forParents: "For Parents",
    forTeachers: "For Teachers",
    forChildren: "For Children",
    nutritionTitle: "Nutrition Recommendations",
    nutritionDescription:
      "Beneficial foods, supplements, and special diets to reduce ADHD symptoms",
    physicalTitle: "Physical Activity",
    physicalDescription:
      "Exercises and physical activities to improve attention and focus",
    environmentalTitle: "Environmental Changes",
    environmentalDescription:
      "Space organization, routines, and visual aids to improve functioning",
    howToUse: "How to use this guide?",
    step1Title: "Choose a category",
    step1Description:
      "Click on the category that's most relevant to your needs",
    step2Title: "Read carefully",
    step2Description: "Each recommendation is based on scientific research",
    step3Title: "Implement gradually",
    step3Description: "Start with one change and add more gradually",
    studentForm: "Student Form",
    parentForm: "Parent Form",
    teacherForm: "Teacher Form",
    diagnosisForm: "NODUS Diagnosis",
    popupTitle: "Complete Required Forms",
    backToDashboard: "Back to Dashboard",
    parentNotificationSent: "Parent has been notified about the form",
    teacherNotificationSent: "Teacher has been notified about the form",
    diagnosisRequestSent: "Diagnosis request has been sent to teacher",
    errorSendingNotification: "Error sending notification",
    errorHandlingDiagnosis: "Error handling diagnosis request",
    popupSubtitle:
      "To view personalized recommendations, please complete the following forms:",
    completedStatus: "Completed",
    missingStatus: "Missing",
    completeFormsBtn: "Complete Forms",
    progressText: "Progress",
    formsCompleted: "forms completed",
    studentFormDesc: "Information about the student's behavior and preferences",
    parentFormDesc: "Parent observations and home environment details",
    teacherFormDesc: "Teacher observations and classroom behavior",
    diagnosisFormDesc: "Professional NODUS diagnostic assessment",
    accessBlocked: "Access blocked until all forms are completed",
    unknownUser: "👤 Unknown user",
    viewingAsParent: "You are viewing as parent for",
    viewingAsTeacher: "You are viewing as teacher for",
  },
  he: {
    title: "המלצות",
    nutritionalAdvice: "המלצות תזונה",
    physicalActivity: "המלצות פעילות גופנית",
    environmentalModifications: "התאמות סביבתיות",
    formalRecommendations: "קובץ המלצות פורמלי:",
    greeting: "בוקר טוב",
    viewRecommendations: "צפייה בהמלצות",
    home: "דף הבית",
    noRecommendations: "לא נמצאו המלצות.",
    guideTitle: "מדריך המלצות ADHD",
    guideSubtitle: "המלצות מבוססות מחקר לילדים עם הפרעות קשב וריכוז",
    forParents: "להורים",
    forTeachers: "למורים",
    forChildren: "לילדים",
    nutritionTitle: "המלצות תזונה",
    nutritionDescription:
      "מזונות מועילים, תוספים ודיאטות מיוחדות להפחתת תסמיני ADHD",
    physicalTitle: "פעילות גופנית",
    physicalDescription: "תרגילים ופעילויות גופניות לשיפור קשב וריכוז",
    environmentalTitle: "שינויים סביבתיים",
    environmentalDescription:
      "ארגון מרחב, שגרות ועזרים ויזואליים לשיפור התפקוד",
    howToUse: "איך להשתמש במדריך?",
    step1Title: "בחר קטגוריה",
    step1Description: "לחץ על הקטגוריה הרלוונטית ביותר לצרכים שלך",
    step2Title: "קרא בעיון",
    step2Description: "כל המלצה מבוססת על מחקר מדעי",
    step3Title: "יישם בהדרגה",
    step3Description: "התחל משינוי אחד והוסף עוד בהדרגה",
    studentForm: "שאלון תלמיד",
    parentForm: "שאלון הורה",
    teacherForm: "שאלון מורה",
    diagnosisForm: "אבחון נודוס",
    popupTitle: "השלמת טפסים נדרשים",
    backToDashboard: "חזרה לדשבורד",
    parentNotificationSent: "ההורה עודכן על השאלון",
    teacherNotificationSent: "המורה עודכן על השאלון",
    diagnosisRequestSent: "בקשה לאבחון נשלחה למורה",
    errorSendingNotification: "שגיאה בשליחת העדכון",
    errorHandlingDiagnosis: "שגיאה בטיפול בבקשת האבחון",
    popupSubtitle:
      "כדי לצפות בהמלצות מותאמות אישית, יש להשלים את הטפסים הבאים:",
    completedStatus: "הושלם",
    missingStatus: "חסר",
    completeFormsBtn: "השלם טפסים",
    progressText: "התקדמות",
    formsCompleted: "טפסים הושלמו",
    studentFormDesc: "מידע על התנהגות התלמיד והעדפותיו",
    parentFormDesc: "תצפיות הורים ופרטי הסביבה הביתית",
    teacherFormDesc: "תצפיות מורים והתנהגות בכיתה",
    diagnosisFormDesc: "הערכה אבחנתית מקצועית של נודוס",
    accessBlocked: "הגישה חסומה עד להשלמת כל הטפסים",
    unknownUser: "👤 משתמש לא מזוהה",
    viewingAsParent: "הנך צופה כהורה עבור",
    viewingAsTeacher: "הנך צופה כמורה עבור",
  },
};

const MissingFormsPopup = ({
  isVisible,
  status,
  language = "he",
  studentId,
  studentName = "",
  navigate,
  viewerRole,
  viewerId,
  onRefresh,
}) => {
  if (!isVisible) return null;

  const t = translations[language];
  const isRTL = language === "he";
  if (!viewerRole) {
    console.error("⚠️ viewerRole is required but not provided!");
    return null;
  }

  const totalForms = 4;
  const completedForms = [
    status?.studentFormCompleted,
    status?.parentFormCompleted,
    status?.teacherFormCompleted,
    status?.diagnosisCompleted,
  ].filter(Boolean).length;

  const progressPercentage = (completedForms / totalForms) * 100;

  const handleStudentFormClick = () => {
    navigate(`/questionnaire/student/${studentId}`);
  };

  const handleParentFormClick = () => {
    navigate(`/questionnaire/parent/${studentId}`);
  };

  const handleTeacherFormClick = () => {
    navigate(`/questionnaire/teacher/${studentId}`);
  };

  const handleDiagnosisClick = async () => {
    try {
      const response = await fetch(
        `/api/diagnosis/check-availability/${studentId}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.available) {
          navigate(`/assessment?studentId=${studentId}`);
        } else {
          await fetch("/api/notifications/teacher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              studentName,
              type: "diagnosis_request",
              message: `נדרש אבחון נודוס עבור ${studentName}`,
            }),
          });

          alert(t.diagnosisRequestSent);
        }
      } else {
        navigate(`/assessment?studentId=${studentId}`);
      }
    } catch (error) {
      console.error("Failed to handle diagnosis:", error);
      navigate(`/assessment?studentId=${studentId}`);
    }
  };
  const handleBackToDashboard = () => {
    if (viewerRole === "student") {
      navigate(`/student-dashboard?studentId=${studentId}`);
    } else if (viewerRole === "parent") {
      navigate(`/parent-dashboard?studentId=${studentId}`);
    } else if (viewerRole === "teacher") {
      navigate(`/teacher-dashboard`);
    } else {
      navigate(`/dashboard`);
    }
  };

  const canUserFillForm = (formKey) => {
    switch (formKey) {
      case "studentForm":
        return viewerRole === "student";
      case "parentForm":
        return viewerRole === "parent";
      case "teacherForm":
        return viewerRole === "teacher";
      case "diagnosisForm":
        return viewerRole === "teacher" || viewerRole === "admin";
      default:
        return false;
    }
  };

  const getButtonText = (formKey, completed) => {
    if (completed) return t.completedStatus;

    if (canUserFillForm(formKey)) {
      return "מלא שאלון";
    } else {
      switch (formKey) {
        case "studentForm":
          return "השאלון ממתין לתלמיד";
        case "parentForm":
          return "השאלון ממתין להורה";
        case "teacherForm":
          return "השאלון ממתין למורה";
        case "diagnosisForm":
          return "האבחון ממתין למורה";
        default:
          return t.missingStatus;
      }
    }
  };

  const forms = [
    {
      key: "studentForm",
      name: t.studentForm,
      description: t.studentFormDesc,
      completed: status?.studentFormCompleted || false,
      icon: <Users className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: handleStudentFormClick,
      actionIcon: <FileText className="w-4 h-4" />,
    },
    {
      key: "parentForm",
      name: t.parentForm,
      description: t.parentFormDesc,
      completed: status?.parentFormCompleted || false,
      icon: <Users className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      onClick: handleParentFormClick,
      actionIcon: <FileText className="w-4 h-4" />,
    },
    {
      key: "teacherForm",
      name: t.teacherForm,
      description: t.teacherFormDesc,
      completed: status?.teacherFormCompleted || false,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: handleTeacherFormClick,
      actionIcon: <FileText className="w-4 h-4" />,
    },
    {
      key: "diagnosisForm",
      name: t.diagnosisForm,
      description: t.diagnosisFormDesc,
      completed: status?.diagnosisCompleted || false,
      icon: <Activity className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: handleDiagnosisClick,
      actionIcon: <Activity className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t.popupTitle}</h2>
            </div>
          </div>
          <p className="mt-2 text-white/90">{t.popupSubtitle}</p>
          <div className="mt-3 text-sm text-white/80">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            {t.accessBlocked}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div
              className={`flex items-center justify-between mb-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {t.progressText}
              </span>
              <span className="text-sm text-gray-500">
                {completedForms}/{totalForms} {t.formsCompleted}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {forms.map((form) => (
              <div
                key={form.key}
                className={`border-2 rounded-lg p-4 transition-all ${
                  form.completed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${form.bgColor}`}>
                      <div className={form.color}>{form.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {form.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {form.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {form.completed ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-700">
                            {t.completedStatus}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">
                            {t.missingStatus}
                          </span>
                        </>
                      )}
                    </div>

                    {!form.completed && <></>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* action Buttons*/}
          <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              onClick={handleBackToDashboard}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToDashboard}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Recommendations() {
  const { language: contextLanguage, setLanguage } = useSettings();
  const [currentLanguage, setCurrentLanguage] = useState(() =>
    getStoredLanguage()
  );

  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang && (storedLang === "en" || storedLang === "he")) {
      if (storedLang !== contextLanguage) {
        setLanguage(storedLang as "en" | "he");
      }
      if (storedLang !== currentLanguage) {
        setCurrentLanguage(storedLang);
      }
    }
  }, []);

  useEffect(() => {
    saveLanguage(currentLanguage);
  }, [currentLanguage]);

  interface RecommendationStatus {
    studentFormCompleted: boolean;
    parentFormCompleted: boolean;
    teacherFormCompleted: boolean;
    diagnosisCompleted: boolean;
  }
  useEffect(() => {
    if (contextLanguage !== currentLanguage) {
      setCurrentLanguage(contextLanguage);
      saveLanguage(contextLanguage as "en" | "he");
    }
  }, [contextLanguage, currentLanguage]);

  const [role, setRole] = useState<string | null>(null);
  const [noAdhdDetected, setNoAdhdDetected] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setRole(parsedUser?.role || null);
      } catch (error) {
        console.error("❌ שגיאה בפריסת המשתמש:", error);
      }
    }
  }, []);

  const [currentUserRole, setCurrentUserRole] = useState<
    "student" | "parent" | "teacher" | "admin" | "unknown"
  >("unknown");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [status, setStatus] = useState<RecommendationStatus | null>(null);
  const [showIncompleteFormsPopup, setShowIncompleteFormsPopup] =
    useState(false);

  const t = translations[currentLanguage];
  const isRTL = currentLanguage === "he";
  const currentDate = useMemo(
    () =>
      getLocalizedDate(
        format(new Date(), "EEEE, MMM do, yyyy"),
        currentLanguage as "en" | "he"
      ),
    [currentLanguage]
  );
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlStudentId = params.get("studentId");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [studentName, setStudentName] = useState<string>("");

  const studentId =
    new URLSearchParams(location.search).get("studentId") ||
    localStorage.getItem("studentId");

  const refreshFormsStatus = useCallback(async () => {
    if (!studentId) return;

    try {
      const statusResponse = await fetch(
        `/api/forms/check-status/${studentId}`
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setStatus(statusData);

        const allFormsCompleted =
          statusData.studentFormCompleted &&
          statusData.parentFormCompleted &&
          statusData.teacherFormCompleted &&
          statusData.diagnosisCompleted;

        if (allFormsCompleted) {
          setShowIncompleteFormsPopup(false);
        }
      }
    } catch (err) {
      console.error("❌ Failed to refresh forms status:", err);
    }
  }, [studentId]);

  const isStudentViewer =
    currentUserRole === "student" &&
    String(currentUserId ?? "") === String(studentId ?? "");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTypeSelectionModal, setShowTypeSelectionModal] = useState(false);
  const [userPreference, setUserPreference] = useState<"main" | "both" | null>(
    null
  );
  const [hasMultipleTypes, setHasMultipleTypes] = useState(false);
  const [recommendationData, setRecommendationData] =
    useState<RecommendationResponseData | null>(null);

  const goToViewerDashboard = useCallback(() => {
    const r = currentUserRole;
    if (r === "teacher" || r === "student" || r === "parent" || r === "admin") {
      navigate(getViewerDashboardUrl(r), { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, currentUserRole]);

  const fetchRecommendations = useCallback(
    async (
      preference?: "main" | "both"
    ): Promise<RecommendationResponseData | null> => {
      try {
        const queryParams = new URLSearchParams({
          lang: currentLanguage,
        });

        if (preference) {
          queryParams.append("view", preference);
        }
        const recommendationsResponse = await fetch(
          `/api/recommendations/${studentId}?${queryParams.toString()}`
        );

        if (recommendationsResponse.ok) {
          const data: RecommendationResponseData =
            await recommendationsResponse.json();

          if (
            data.noAdhd === true ||
            data.recommendationTypesList?.includes("No ADHD")
          ) {
            setNoAdhdDetected(true);
            setRecommendations([]);
            return data;
          }

          const filteredRecommendations = data.recommendations || [];
          setRecommendations(filteredRecommendations);
          setRecommendationData({
            ...data,
            recommendations: filteredRecommendations,
          });

          return data;
        } else {
          console.warn(
            "⚠️ Failed to fetch recommendations:",
            recommendationsResponse.status
          );
          setRecommendations([]);
          return null;
        }
      } catch (err) {
        console.error("❌ Failed to load recommendations:", err);
        setRecommendations([]);
        return null;
      }
    },
    [currentLanguage, studentId]
  );

  const handlePreferenceSelect = async (preference: "main" | "both") => {
    setShowTypeSelectionModal(false);
    setUserPreference(preference);
    sessionStorage.setItem("recommendationPreference", preference);

    await fetchRecommendations(preference);
  };

  const loadCurrentUser = useCallback(async () => {
    try {
      // A) קודם כל – נסי להביא את המשתמש המחובר מ- localStorage.user
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          if (u?._id && u?.role) {
            setCurrentUserId(String(u._id));
            setCurrentUserRole(u.role);
            return { userId: String(u._id), role: u.role };
          }
        } catch {}
      }

      // B) מפתחות מפוצלים (אם קיימים)
      const storedUserId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      const storedUserRole =
        localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
      if (storedUserId && storedUserRole) {
        setCurrentUserId(storedUserId);
        setCurrentUserRole(storedUserRole as any);
        return { userId: storedUserId, role: storedUserRole };
      }

      // C) API (אם יש טוקן)
      const authToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (authToken) {
        try {
          const resp = await fetch("/api/auth/current-user", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data?.success && data?.userId && data?.role) {
              setCurrentUserId(String(data.userId));
              setCurrentUserRole(data.role);
              localStorage.setItem("userId", String(data.userId));
              localStorage.setItem("userRole", data.role);
              return { userId: String(data.userId), role: data.role };
            }
          }
        } catch {}
      }

      // D) ברירת מחדל בטוחה – לא "student"
      setCurrentUserRole("unknown");
      setCurrentUserId(null);
      return { userId: null, role: "unknown" as const };
    } catch {
      setCurrentUserRole("unknown");
      setCurrentUserId(null);
      return { userId: null, role: "unknown" as const };
    }
  }, []);

  useEffect(() => {
    const initializeComponent = async () => {
      console.log("🚀 Initializing Recommendations component...");

      if (!studentId) {
        console.error("❌ No studentId provided");
        return;
      }

      const currentUser = await loadCurrentUser();
      console.log("👤 Current user:", currentUser);

      const savedPreference = sessionStorage.getItem(
        "recommendationPreference"
      ) as "main" | "both" | null;

      const data = await fetchRecommendations(savedPreference || undefined);

      if (data) {
        const multipleTypes =
          data.multipleTypes && data.subTypes && data.subTypes.length > 0;
        setHasMultipleTypes(multipleTypes);

        if (multipleTypes) {
          if (savedPreference) {
            setUserPreference(savedPreference);
          } else {
            setShowTypeSelectionModal(true);
          }
        }
      }
      try {
        const statusResponse = await fetch(
          `/api/forms/check-status/${studentId}`
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStatus(statusData);

          const hasIncompleteForm =
            !statusData.studentFormCompleted ||
            !statusData.parentFormCompleted ||
            !statusData.teacherFormCompleted ||
            !statusData.diagnosisCompleted;

          if (hasIncompleteForm) {
            setShowIncompleteFormsPopup(true);
          }

          console.log("✅ Forms status loaded:", statusData);
        } else {
          console.warn(
            "⚠️ Failed to fetch forms status:",
            statusResponse.status
          );
          setShowIncompleteFormsPopup(false);
        }
      } catch (err) {
        console.error("❌ Failed to load recommendation status:", err);
        setShowIncompleteFormsPopup(false);
      }

      try {
        const studentResponse = await fetch(`/api/users/${studentId}`);

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          const user = studentData.data || studentData;

          if (user.firstName && user.lastName) {
            setStudentName(`${user.firstName} ${user.lastName}`);
          } else if (user.name) {
            setStudentName(user.name);
          } else {
            setStudentName("תלמיד");
          }
        } else {
          console.warn(
            "⚠️ Failed to fetch student data:",
            studentResponse.status
          );
          setStudentName("תלמיד");
        }
      } catch (err) {
        console.error("❌ Failed to load student name:", err);
        setStudentName("תלמיד");
      }

      setLoading(false);
    };

    initializeComponent();
  }, [studentId, currentLanguage, loadCurrentUser, fetchRecommendations]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Page became visible, refreshing status...");
        refreshFormsStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshFormsStatus]);

  const handleToggleChange = async (preference: "main" | "both") => {
    setUserPreference(preference);
    sessionStorage.setItem("recommendationPreference", preference);

    await fetchRecommendations(preference);
  };

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: studentName || "תלמיד", href: `/student/${studentId}` },
    { label: t.title },
  ];

  const getGreetingTitle = () => {
    const timeGreeting = getTimeBasedGreeting(currentLanguage);
    if (!studentId || !studentName) return t.unknownUser;

    if (
      currentUserRole === "student" &&
      String(currentUserId ?? "") === String(studentId)
    ) {
      return `${timeGreeting}, ${studentName}`;
    }
    if (currentUserRole === "parent") {
      return `${timeGreeting} - ${t.viewingAsParent} ${studentName}`;
    }
    if (currentUserRole === "teacher") {
      return `${timeGreeting} - ${t.viewingAsTeacher} ${studentName}`;
    }
    return t.unknownUser;
  };

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex items-center gap-8 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Logo size="sm" showText={false} className="h-20 mx-auto mb-1" />
            </div>
            <div
              className={`flex items-center gap-8 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <LanguageToggle variant="button" />
              <HelpButton
                page="viewRecommendations"
                language={currentLanguage as "en" | "he"}
                variant="icon"
                className={isRTL ? "ml-2" : "mr-2"}
              />
              <span className="text-gray-600">{currentDate}</span>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-10">
          <button
            onClick={goToViewerDashboard}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-0" : ""}`} />
            <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
              {isRTL ? "חזרה לדשבורד" : "Back to Dashboard"}
            </span>
          </button>
        </div>
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {getGreetingTitle()}
          </h1>

          <h2
            className={`text-2xl font-semibold text-gray-700 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {/*t.title*/}
          </h2>
        </div>

        {hasMultipleTypes && userPreference && recommendationData && (
          <RecommendationToggle
            language={currentLanguage as "en" | "he"}
            mainType={recommendationData.mainType || ""}
            subTypes={recommendationData.subTypes || []}
            currentSelection={userPreference}
            onSelectionChange={handleToggleChange}
          />
        )}

        {!loading && noAdhdDetected && (
          <div className="text-center py-12">
            <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                {isRTL ? "תוצאה חיובית!" : "Great News!"}
              </h3>
              <p className="text-lg text-gray-700 mb-4">
                {isRTL
                  ? "בהתאם לאבחון שבוצע, לא אותרו סימנים משמעותיים להפרעות קשב וריכוז (ADHD)."
                  : "Based on the assessment conducted, no significant signs of ADHD were detected."}
              </p>
              <p className="text-gray-600">
                {isRTL
                  ? "לכן, אין צורך בהמלצות מותאמות אישית בשלב זה."
                  : "Therefore, personalized recommendations are not needed at this time."}
              </p>
              <div className="mt-6">
                <Button
                  onClick={goToViewerDashboard}
                  className="bg-gradient-to-br from-green-400 to-blue-400 hover:bg-blue-700"
                >
                  {isRTL ? "חזרה לדשבורד" : "Back to Dashboard"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* No Recommendations State (when there IS ADHD but no recs) */}
        {!loading &&
          !noAdhdDetected &&
          recommendations.length === 0 &&
          studentId && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p
                className={`text-gray-600 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.noRecommendations}
              </p>
            </div>
          )}
        {!noAdhdDetected && (
          <>
            {/* ADHD Guide Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-4 text-center">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-800">
                  {t.guideTitle}
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-6 text-center">
                {t.guideSubtitle}
              </p>

              {/* Target Audience */}
              <div
                className={`flex items-center justify-center gap-10 text-sm text-gray-600 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Users
                    className={`h-5 w-5 text-blue-500 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                  <span>{t.forParents}</span>
                </div>
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <BookOpen
                    className={`h-5 w-5 text-green-500 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                  <span>{t.forTeachers}</span>
                </div>
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Activity
                    className={`h-5 w-5 text-purple-500 ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                  <span>{t.forChildren}</span>
                </div>
              </div>
            </div>

            {/* Recommendation Type Cards - Fixed Height */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
              {/* Nutrition Card */}
              <Card
                className={`p-5 hover:shadow-lg transition-shadow h-full flex flex-col ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`bg-green-100 rounded-lg p-6 mb-4 flex-1 flex flex-col ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`text-4xl mb-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    🍎
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-800 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.nutritionTitle}
                  </h3>
                  <p
                    className={`text-gray-600 text-sm mb-4 flex-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.nutritionDescription}
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 mt-auto"
                    onClick={() =>
                      navigate(
                        `/nutritional-recommendations?studentId=${studentId}`
                      )
                    }
                  >
                    {t.viewRecommendations} →
                  </Button>
                </div>
              </Card>

              {/* Physical Activity Card */}
              <Card
                className={`p-5 hover:shadow-lg transition-shadow h-full flex flex-col ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`bg-blue-100 rounded-lg p-6 mb-4 flex-1 flex flex-col ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`text-4xl mb-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    🏃‍♂️
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-800 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.physicalTitle}
                  </h3>
                  <p
                    className={`text-gray-600 text-sm mb-4 flex-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.physicalDescription}
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-auto"
                    onClick={() =>
                      navigate(
                        `/physical-recommendations?studentId=${studentId}`
                      )
                    }
                  >
                    {t.viewRecommendations} →
                  </Button>
                </div>
              </Card>

              {/* Environmental Card */}
              <Card
                className={`p-5 hover:shadow-lg transition-shadow h-full flex flex-col ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`bg-purple-100 rounded-lg p-6 mb-4 flex-1 flex flex-col ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`text-4xl mb-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    🏠
                  </div>
                  <h3
                    className={`text-xl font-bold text-gray-800 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.environmentalTitle}
                  </h3>
                  <p
                    className={`text-gray-600 text-sm mb-4 flex-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t.environmentalDescription}
                  </p>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 mt-auto"
                    onClick={() =>
                      navigate(
                        `/Environmental-recommendations?studentId=${studentId}`
                      )
                    }
                  >
                    {t.viewRecommendations} →
                  </Button>
                </div>
              </Card>
            </div>

            {/* How to Use Guide */}
            <div className="bg-white rounded-lg p-3 shadow-sm border mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t.howToUse}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t.step1Title}
                  </h4>
                  <p className="text-gray-600 text-sm">{t.step1Description}</p>
                </div>

                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t.step2Title}
                  </h4>
                  <p className="text-gray-600 text-sm">{t.step2Description}</p>
                </div>

                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t.step3Title}
                  </h4>
                  <p className="text-gray-600 text-sm">{t.step3Description}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3
                className={`text-xl font-semibold mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              ></h3>
              <Card className="p-6">
                <RecommendationPdfView
                  recommendations={recommendations}
                  isLoading={!studentId || loading}
                  noAdhd={noAdhdDetected}
                />
              </Card>
            </div>
          </>
        )}
      </main>
      {showTypeSelectionModal && recommendationData && (
        <RecommendationTypeSelectionModal
          isOpen={showTypeSelectionModal}
          language={currentLanguage as "en" | "he"}
          mainType={recommendationData.mainType}
          subTypes={recommendationData.subTypes}
          onSelectPreference={handlePreferenceSelect}
        />
      )}
      <MissingFormsPopup
        isVisible={showIncompleteFormsPopup}
        status={status}
        language={currentLanguage}
        studentId={studentId}
        studentName={studentName}
        navigate={navigate}
        viewerRole={currentUserRole}
        viewerId={currentUserId}
        onRefresh={refreshFormsStatus}
      />
    </div>
  );
}
