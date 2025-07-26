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
import { useState, useEffect } from "react";
import RecommendationPdfView from "@/components/RecommendationPdfView";
import { useSettings } from "@/components/SettingsContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { Logo } from "@/components/ui/logo";

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
  },
};

// רכיב הפופאפ המשודרג
const MissingFormsPopup = ({
  isVisible,
  status,
  language = "he",
  studentId,
  studentName = "",
  navigate,
  viewerRole,
  viewerId,
}) => {
  if (!isVisible) return null;

  const t = translations[language];
  const isRTL = language === "he";

  if (!viewerRole) {
    console.error("⚠️ viewerRole is required but not provided!");
    return null;
  }

  console.log("👀 Viewer role in popup:", viewerRole);
  console.log("👀 Viewer Id in popup:", viewerId);

  // חישוב התקדמות
  const totalForms = 4;
  const completedForms = [
    status?.studentFormCompleted,
    status?.parentFormCompleted,
    status?.teacherFormCompleted,
    status?.diagnosisCompleted,
  ].filter(Boolean).length;

  const progressPercentage = (completedForms / totalForms) * 100;

  // פונקציות טיפול בפעולות
  const handleStudentFormClick = () => {
    navigate(`/questionnaire/student/${studentId}`);
  };

  const handleParentFormClick = () => {
    navigate(`/questionnaire/parent/${studentId}`);
  };

  const handleTeacherFormClick = () => {
    navigate(`/questionnaire/teacher/${studentId}`);
  };

  /*const handleParentFormClick = async () => {
    try {
      // שלח הודעה לדשבורד של ההורה
      await fetch("/api/notifications/parent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentName,
          type: "parent_form_request",
          message: `יש שאלון חדש של ${studentName} הממתין להשלמה`,
        }),
      });

      // הצג הודעת אישור
      alert(t.parentNotificationSent);
    } catch (error) {
      console.error("Failed to send parent notification:", error);
      alert(t.errorSendingNotification);
    }
  };

  const handleTeacherFormClick = async () => {
    try {
      // שלח הודעה לדשבורד של המורה
      await fetch("/api/notifications/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          studentName,
          type: "teacher_form_request",
          message: `יש שאלון חדש של ${studentName} הממתין להשלמה`,
        }),
      });

      // הצג הודעת אישור
      alert(t.teacherNotificationSent);
    } catch (error) {
      console.error("Failed to send teacher notification:", error);
      alert(t.errorSendingNotification);
    }
  };*/

  const handleDiagnosisClick = async () => {
    try {
      // בדוק אם יש אבחון זמין
      const response = await fetch(
        `/api/diagnosis/check-availability/${studentId}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.available) {
          // עבור לאבחון - אותו נתיב כמו כפתור newAssessment
          navigate(`/assessment?studentId=${studentId}`);
        } else {
          // שלח בקשה למורה לפתיחת אבחון
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
        // אם אין API endpoint, פשוט נווט ישירות לאבחון
        navigate(`/assessment?studentId=${studentId}`);
      }
    } catch (error) {
      console.error("Failed to handle diagnosis:", error);
      // במקרה של שגיאה, פשוט נווט לאבחון
      navigate(`/assessment?studentId=${studentId}`);
    }
  };
  //לתקן כאן את הכפתור
  const handleBackToDashboard = () => {
    navigate(-1); // חזרה לדף הקודם
  };

  // פונקציה לבדיקה אם המשתמש הנוכחי יכול למלא את הטופס
  const canUserFillForm = (formKey) => {
    switch (formKey) {
      case "studentForm":
        return viewerRole === "student";
      case "parentForm":
        return viewerRole === "parent";
      case "teacherForm":
        return viewerRole === "teacher";
      case "diagnosisForm":
        return viewerRole === "teacher" || viewerRole === "admin"; // רק מורה/אדמין יכול לפתוח אבחון
      default:
        return false;
    }
  };

  // פונקציה לקבלת טקסט הכפתור לפי התפקיד
  const getButtonText = (formKey, completed) => {
    if (completed) return t.completedStatus;

    if (canUserFillForm(formKey)) {
      return "מלא שאלון"; // אם זה השאלון שלי
    } else {
      // אם זה לא השאלון שלי, הצג מי צריך למלא
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

  // רשימת הטפסים עם פרטים ופונקציות
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
        {/* כותרת */}
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

        {/* תוכן */}
        <div className="p-6">
          {/* פס התקדמות */}
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

          {/* רשימת טפסים */}
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

                    {/* כפתור פעולה משופר לכל טופס */}
                    {!form.completed && (
                      <>
                        {/*
                        {canUserFillForm(form.key) ? (
                          // אם המשתמש יכול למלא את הטופס - הצג כפתור פעיל
                        
                          <Button
                            onClick={form.onClick}
                            size="sm"
                            className="text-xs px-3 py-1 flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {form.actionIcon}
                            מלא שאלון
                          </Button>
                        
                        ) : (
                          // אם המשתמש לא יכול למלא - הצג הודעה
                          <div className="text-xs px-3 py-1 text-gray-500 bg-gray-100 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getButtonText(form.key, form.completed)}
                          </div>
                        )}
                        */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* כפתורי פעולה */}
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
  interface RecommendationStatus {
    studentFormCompleted: boolean;
    parentFormCompleted: boolean;
    teacherFormCompleted: boolean;
    diagnosisCompleted: boolean;
  }

  const [role, setRole] = useState<string | null>(null);

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

  const [currentUserRole, setCurrentUserRole] = useState("student");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [status, setStatus] = useState<RecommendationStatus | null>(null);
  const [showIncompleteFormsPopup, setShowIncompleteFormsPopup] =
    useState(false);
  const { language } = useSettings();
  const t = translations[language];
  const isRTL = language === "he";
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlStudentId = params.get("studentId");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [studentName, setStudentName] = useState<string>("");

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedUserId = localUser._id;
  const viewerRole = localUser?.role;
  const studentId =
    new URLSearchParams(location.search).get("studentId") ||
    localStorage.getItem("studentId");

  const isStudentViewer = loggedUserId === studentId;
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // *** פונקציה לטעינת פרטי המשתמש הנוכחי ***
  const loadCurrentUser = async () => {
    try {
      console.log("🔍 Loading current user...");

      // נסה ללוקל סטורג' קודם
      const storedUserId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      const storedUserRole =
        localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

      if (storedUserId && storedUserRole) {
        console.log("✅ Found user in localStorage:", {
          storedUserId,
          storedUserRole,
        });
        setCurrentUserId(storedUserId);
        setCurrentUserRole(storedUserRole);
        return { userId: storedUserId, role: storedUserRole };
      }

      // אם אין במקומי, נסה API (רק אם endpoint קיים)
      const authToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (authToken) {
        try {
          const response = await fetch("/api/auth/current-user", {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            if (userData.success && userData.userId && userData.role) {
              console.log("✅ Loaded user from API:", userData);
              setCurrentUserId(userData.userId);
              setCurrentUserRole(userData.role);

              // שמור ללוקל סטורג'
              localStorage.setItem("userId", userData.userId);
              localStorage.setItem("userRole", userData.role);

              return { userId: userData.userId, role: userData.role };
            }
          }
        } catch (apiError) {
          console.warn("⚠️ API call failed, will use fallback:", apiError);
        }
      }

      // Fallback: ברירת מחדל אם הכל נכשל
      console.log("⚠️ Using fallback - setting as student");
      setCurrentUserRole("student");

      // צור userId זמני אם אין
      const fallbackUserId = studentId || "temp-user-" + Date.now();
      setCurrentUserId(fallbackUserId);

      return { userId: fallbackUserId, role: "student" };
    } catch (error) {
      console.error("❌ Failed to load current user:", error);
      // ברירת מחדל במקרה של שגיאה
      setCurrentUserRole("student");
      setCurrentUserId(studentId || "unknown");
      return { userId: studentId || "unknown", role: "student" };
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      console.log("🚀 Initializing Recommendations component...");

      if (!studentId) {
        console.error("❌ No studentId provided");
        return;
      }

      // 1. טען פרטי המשתמש הנוכחי
      const currentUser = await loadCurrentUser();
      console.log("👤 Current user:", currentUser);

      // 2. טען המלצות
      try {
        const recommendationsResponse = await fetch(
          `/api/recommendations/${studentId}?lang=${language}`
        );

        if (recommendationsResponse.ok) {
          const data = await recommendationsResponse.json();
          const recs = data.recommendations || [];
          setRecommendations(recs);
          console.log("✅ Recommendations fetched:", recs.length);
        } else {
          console.warn(
            "⚠️ Failed to fetch recommendations:",
            recommendationsResponse.status
          );
          setRecommendations([]);
        }
      } catch (err) {
        console.error("❌ Failed to load recommendations:", err);
        setRecommendations([]);
      }

      // 3. טען סטטוס טפסים
      try {
        const statusResponse = await fetch(
          `/api/forms/check-status/${studentId}`
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStatus(statusData);

          // בדוק אם יש טפסים חסרים
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
          // אל תציג פופאפ אם אין מידע על טפסים
          setShowIncompleteFormsPopup(false);
        }
      } catch (err) {
        console.error("❌ Failed to load recommendation status:", err);
        setShowIncompleteFormsPopup(false);
      }

      // 4. טען שם תלמיד
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

          console.log("✅ Student name loaded:", user);
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
  }, [studentId, language]);

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: studentName || "תלמיד", href: `/student/${studentId}` },
    { label: t.title },
  ];

  const getGreetingTitle = () => {
    if (!viewerRole || !studentId || !studentName) return "👤 משתמש לא מזוהה";

    const isSelf = String(loggedUserId) === String(studentId);

    if (viewerRole === "student" && isSelf) {
      return `${t.greeting} ${studentName}`;
    }

    if (viewerRole === "parent") {
      return `👨‍👧 ${t.greeting} - הנך צופה כהורה עבור ${studentName}`;
    }

    if (viewerRole === "teacher") {
      return `🧑‍🏫 ${t.greeting} - הנך צופה כמורה עבור ${studentName}`;
    }

    return "👤 משתמש לא מזוהה";
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
              <Logo size="xs" showText={false} className="h-16 mx-auto mb-6" />
            </div>
            <div
              className={`flex items-center gap-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <LanguageToggle variant="button" />

              <span className="text-gray-600">{currentDate}</span>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {/*
           <div className="mt-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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

        {/* No Recommendations State */}
        {!loading && recommendations.length === 0 && studentId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <p
              className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.noRecommendations}
            </p>
          </div>
        )}

        {/* ADHD Guide Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">{t.guideTitle}</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6 text-center">
            {t.guideSubtitle}
          </p>

          {/* Target Audience */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span>{t.forParents}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-green-500" />
              <span>{t.forTeachers}</span>
            </div>
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              <span>{t.forChildren}</span>
            </div>
          </div>
        </div>

        {/* Recommendation Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Nutrition Card */}
          <Card
            className={`p-6 hover:shadow-lg transition-shadow ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`bg-green-100 rounded-lg p-6 mb-4 ${
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
                className={`text-gray-600 text-sm mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.nutritionDescription}
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
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
            className={`p-6 hover:shadow-lg transition-shadow ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`bg-blue-100 rounded-lg p-6 mb-4 ${
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
                className={`text-gray-600 text-sm mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.physicalDescription}
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  navigate(`/physical-recommendations?studentId=${studentId}`)
                }
              >
                {t.viewRecommendations} →
              </Button>
            </div>
          </Card>

          {/* Environmental Card */}
          <Card
            className={`p-6 hover:shadow-lg transition-shadow ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`bg-purple-100 rounded-lg p-6 mb-4 ${
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
                className={`text-gray-600 text-sm mb-4 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.environmentalDescription}
              </p>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
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
        <div className="bg-white rounded-lg p-8 shadow-sm border mb-8">
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

        {/* Formal Recommendations Section */}
        <div className="text-center">
          <h3
            className={`text-xl font-semibold mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t.formalRecommendations}
          </h3>
          <Card className="p-6">
            {(() => {
              console.log("🐞 PDF Recommendations Preview:", recommendations);
              return null;
            })()}
            <RecommendationPdfView
              recommendations={recommendations}
              isLoading={!studentId || recommendations.length === 0}
            />
          </Card>
        </div>
      </main>
      <MissingFormsPopup
        isVisible={showIncompleteFormsPopup}
        status={status}
        language={language}
        studentId={studentId}
        studentName={studentName}
        navigate={navigate}
        viewerRole={currentUserRole}
        viewerId={currentUserId} // הוסף את השורה הזו
      />
    </div>
  );
}
