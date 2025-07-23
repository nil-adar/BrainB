import {
  Search,
  Bell,
  UserCircle,
  ArrowLeft,
  Info,
  Eye,
  Home,
  Brain,
  Headphones,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSettings } from "@/components/SettingsContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Logo } from "@/components/ui/logo";

const translations = {
  en: {
    title: "Environmental Changes",
    search: "Search",
    greeting: "Good morning",
    home: "Home",
    recommendations: "Recommendations",
    back: "Back",
    loading: "Loading recommendations...",
    noRecommendations: "No environmental recommendations found.",
    importantNote: "Important to remember:",
    disclaimer:
      "Environmental changes require individual adaptation for each child. Start with one change at a time and check effectiveness before adding additional changes.",
    difficulty: "Difficulty Description:",
    recommendation: "Recommendation:",
    implementationMethods: "Implementation Methods:",
    functionalContribution: "Functional Contribution:",
    visual: "Visual",
    organization: "Organization",
    combined: "Combined",
    routine: "Routine",
    environment: "Environment",
    sensory: "Sensory",
    // נוסף עבור עקביות לוגיקת הברכה
    unidentifiedUser: "Unidentified User",
    viewingAsParent: "Viewing as Parent for",
    viewingAsTeacher: "Viewing as Teacher for",
  },
  he: {
    title: "שינויים סביבתיים",
    search: "חיפוש",
    greeting: "בוקר טוב",
    home: "דף הבית",
    recommendations: "המלצות",
    back: "חזרה",
    loading: "טוען המלצות...",
    noRecommendations: "לא נמצאו המלצות סביבתיות.",
    importantNote: "חשוב לזכור:",
    disclaimer:
      "שינויים סביבתיים דורשים התאמה אישית לכל ילד. התחילו בשינוי אחד בכל פעם ובדקו יעילות לפני הוספת שינויים נוספים.",
    difficulty: "תיאור הקושי:",
    recommendation: "המלצה:",
    implementationMethods: "שיטות יישום:",
    functionalContribution: "תרומה פונקציונלית:",
    visual: "ויזואלי",
    organization: "ארגון",
    combined: "משולב",
    routine: "שגרה",
    environment: "סביבה",
    sensory: "חושי",
    // נוסף עבור עקביות לוגיקת הברכה
    unidentifiedUser: "👤 משתמש לא מזוהה",
    viewingAsParent: "👨‍👧 הנך צופה כהורה עבור",
    viewingAsTeacher: "🧑‍🏫 הנך צופה כמורה עבור",
  },
};

interface Recommendation {
  _id: string;
  difficulty_description: { en: string; he: string };
  recommendation: { en: string; he: string };
  example: { en: string[] | string; he: string[] | string };
  contribution: { en: string; he: string };
  implementation_methods?: { en: string[] | string; he: string[] | string };
  tags?: string[];
  category?: string;
  catagory?: { en: string; he: string };
  icon?: string;
}

const getText = (
  field: string | { he: string; en: string } | undefined,
  lang: "he" | "en"
) => {
  if (!field) return "-";
  if (typeof field === "string") return field;
  return field[lang] ?? "-";
};

export default function EnvironmentalRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("");
  // הוספת מצבים (State) עבור פרטי המשתמש המחובר
  const [loggedUserId, setLoggedUserId] = useState<string | null>(null);
  const [viewerRole, setViewerRole] = useState<string | null>(null);

  const { language } = useSettings();
  const t = translations[language];
  const isRTL = language === "he";
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();
  const location = useLocation();

  // Get studentId from URL params
  const params = new URLSearchParams(location.search);
  let studentId = params.get("studentId");

  // If not in query params, try to extract from pathname
  if (!studentId) {
    const pathParts = location.pathname.split("/");
    const studentIndex = pathParts.indexOf("student");
    if (studentIndex !== -1 && pathParts[studentIndex + 1]) {
      studentId = pathParts[studentIndex + 1];
    }
  }

  // Effect לטעינת ה-ID והתפקיד של המשתמש המחובר מ-localStorage
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setLoggedUserId(localUser._id || null);
    setViewerRole(localUser.role || null);
  }, []); // ריצה פעם אחת בהרצת הרכיב

  useEffect(() => {
    console.log("🏠 Environmental Recommendations useEffect started");
    console.log("📍 Current location:", location);
    console.log("🆔 Student ID:", studentId);
    console.log("🌍 Current language:", language);

    const loadRecommendations = async () => {
      try {
        console.log("🚀 Starting to load environmental recommendations...");

        let finalStudentId = studentId;
        if (!finalStudentId) {
          const pathParts = location.pathname.split("/");
          const studentIndex = pathParts.indexOf("student");
          if (studentIndex !== -1 && pathParts[studentIndex + 1]) {
            finalStudentId = pathParts[studentIndex + 1];
            console.log("🔄 Got studentId from path:", finalStudentId);
          }
        }

        if (!finalStudentId) {
          console.log("❌ No studentId found");
          setRecommendations([]);
          return;
        }

        console.log("📡 Fetching recommendations for student:", finalStudentId);
        console.log("🌍 Using language:", language);

        const response = await fetch(
          `/api/recommendations/${finalStudentId}?lang=${language}`
        );
        console.log("📬 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Raw data received:", data);

        const allRecs = data.recommendations || [];
        console.log(
          "📊 Total recommendations for this student:",
          allRecs.length
        );

        // הפילטר הנכון - רק לפי type
        const environmentalRecs = allRecs.filter((rec: any) => {
          const isEnvironmental = rec.type === "environment";

          if (isEnvironmental) {
            console.log("🏠 Found environmental rec:", {
              id: rec._id,
              type: rec.type,
              title: rec.recommendation?.[language],
            });
          }

          return isEnvironmental;
        });

        console.log(
          "🏠 Environmental recommendations for this student:",
          environmentalRecs.length
        );
        setRecommendations(environmentalRecs);
      } catch (error) {
        console.error(
          "❌ Failed to load environmental recommendations:",
          error
        );
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    const loadStudentName = async () => {
      if (!studentId) {
        setStudentName("Student");
        return;
      }

      try {
        const response = await fetch(`/api/users/${studentId}`);
        const data = await response.json();
        const user = data.data;

        if (user.firstName && user.lastName) {
          setStudentName(`${user.firstName} ${user.lastName}`);
        } else if (user.name) {
          setStudentName(user.name);
        } else {
          setStudentName("Student");
        }
      } catch (error) {
        console.error("❌ Failed to load student name:", error);
        setStudentName("Student");
      }
    };

    loadRecommendations();
    loadStudentName();
  }, [studentId, language, location]);

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: studentName || "Student", href: `/student/${studentId}` },
    {
      label: t.recommendations,
      href: `/recommendations?studentId=${studentId}`,
    },
    { label: t.title },
  ];

  const formatMethods = (methods: string[] | string | undefined): string[] => {
    if (!methods) return [];
    if (Array.isArray(methods)) {
      return methods;
    }
    return [methods];
  };

  const getTagColor = (tag: string): string => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes("visual") || tagLower.includes("ויזואלי"))
      return "bg-blue-100 text-blue-800";
    if (tagLower.includes("organization") || tagLower.includes("ארגון"))
      return "bg-green-100 text-green-800";
    if (tagLower.includes("routine") || tagLower.includes("שגרה"))
      return "bg-purple-100 text-purple-800";
    if (tagLower.includes("environment") || tagLower.includes("סביבה"))
      return "bg-orange-100 text-orange-800";
    if (tagLower.includes("combined") || tagLower.includes("משולב"))
      return "bg-pink-100 text-pink-800";
    if (tagLower.includes("inattentive") || tagLower.includes("קשב"))
      return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getIconByType = (icon: string | undefined) => {
    switch (icon) {
      case "eye":
        return <Eye className="h-6 w-6" />;
      case "home":
        return <Home className="h-6 w-6" />;
      case "brain":
        return <Brain className="h-6 w-6" />;
      case "headphones":
        return <Headphones className="h-6 w-6" />;
      default:
        return <PenTool className="h-6 w-6" />;
    }
  };

  // פונקציה לבניית הודעת הברכה המותאמת אישית
  const getGreetingTitle = () => {
    if (!viewerRole || !studentId || !studentName) return t.unidentifiedUser;

    // השווה את ה-ID של המשתמש המחובר ל-ID של התלמיד (ודא שהם מאותו טיפוס)
    const isSelf = String(loggedUserId) === String(studentId);

    // בנה את הודעת הברכה לפי תפקיד המשתמש
    if (viewerRole === "student" && isSelf) {
      return `${t.greeting} ${studentName}`; // לדוגמה: "בוקר טוב דני"
    }

    if (viewerRole === "parent") {
      return `${t.greeting} ${t.viewingAsParent} ${studentName}`; // לדוגמה: "בוקר טוב 👨‍👧 הנך צופה כהורה עבור דני"
    }

    if (viewerRole === "teacher") {
      return `${t.greeting} ${t.viewingAsTeacher} ${studentName}`; // לדוגמה: "בוקר טוב 🧑‍🏫 הנך צופה כמורה עבור דני"
    }

    // ברירת מחדל אם התפקיד אינו מוכר
    return t.unidentifiedUser;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-20 to-purple-100 ${
        isRTL ? "rtl" : "ltr"
      }`}
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
              <Logo size="xs" showText={false} className="h-10" />

              <div className="relative flex items-center">
                <Search
                  className={`absolute ${
                    isRTL ? "right-3" : "left-3"
                  } h-5 w-5 text-gray-400`}
                />
                <Input
                  type="search"
                  placeholder={t.search}
                  className={`${isRTL ? "pr-10" : "pl-10"} w-[300px]`}
                />
              </div>
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
          <div className="mt-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <div
            className={`flex items-center gap-4 ${
              isRTL ? "flex-row-reverse justify-end" : "justify-start"
            }`}
          >
            <Button
              variant="ghost"
              onClick={() =>
                navigate(`/recommendations?studentId=${studentId}`)
              }
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
              {t.back}
            </Button>
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Home className="h-8 w-8 text-purple-400" />
              <h1
                className={`text-3xl font-bold ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
          <h2
            className={`text-2xl font-semibold text-gray-700 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {getGreetingTitle()} {/* שימוש בפונקציית הברכה החדשה */}
          </h2>
        </div>

        {/* Important Note */}
        <Card className="mb-6 border-purple-100 bg-purple-50">
          <CardContent className="p-4">
            <div
              className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Info
                className={`h-5 w-5 text-purple-300 mt-1 ${
                  isRTL ? "ml-3" : "mr-3"
                } flex-shrink-0`}
              />
              <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
                <p
                  className={`text-purple-400 font-medium ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.importantNote}
                </p>
                <p
                  className={`text-gray-600 text-sm ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.disclaimer}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info - Remove in production */}
        {/*process.env.NODE_ENV === "development" && (
          <div
            className={`bg-blue-50 p-4 rounded-lg mb-6 text-sm font-mono ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div>
              <strong>Debug Info:</strong>
            </div>
            <div>Student ID: {studentId || "undefined"}</div>
            <div>Location: {location.pathname}</div>
            <div>Search: {location.search}</div>
            <div>Language: {language}</div>
            <div>Recommendations: {recommendations.length}</div>
            <div>Loading: {loading.toString()}</div>
            <div>
              Sample recommendation:{" "}
              {JSON.stringify(recommendations[0]?.recommendation, null, 2)}
            </div>
          </div>
        )*/}

        {/* No Student ID State */}
        {!loading && !studentId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3
              className={`text-xl font-semibold mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              Missing Student Information
            </h3>
            <p
              className={`text-gray-600 mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              We need a student ID to load personalized recommendations.
            </p>
            <Button
              onClick={() => navigate("/recommendations")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Recommendations
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p
              className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
            >
              {t.loading}
            </p>
          </div>
        )}

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

        {/* Recommendations */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const implementationMethods = formatMethods(
                rec.implementation_methods?.[language] || rec.example[language]
              );
              const tags = rec.tags || [];

              return (
                <Card
                  key={rec._id}
                  className={`overflow-hidden ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`bg-purple-300 p-4 text-white ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`flex items-center w-full ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL
                            ? "flex-1 justify-end flex-row-reverse"
                            : "flex-1"
                        }`}
                      >
                        {getIconByType(rec.icon)}
                        <h3
                          className={`text-xl font-bold ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {getText(rec.recommendation, language)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <CardContent
                    className={`p-6 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {/* Difficulty Description */}
                    <div className="mb-6">
                      <h4
                        className={`font-semibold text-gray-800 mb-2 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.difficulty}
                      </h4>
                      <p
                        className={`text-gray-600 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getText(rec.difficulty_description, language)}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-6">
                      <h4
                        className={`font-semibold text-gray-800 mb-2 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.recommendation}
                      </h4>
                      <p
                        className={`text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getText(rec.recommendation, language)}
                      </p>
                    </div>

                    {/* Implementation Methods */}
                    <div className="mb-6">
                      <h4
                        className={`font-semibold text-gray-800 mb-3 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.implementationMethods}
                      </h4>
                      <div className="space-y-2">
                        {implementationMethods.map((method, index) => (
                          <div
                            key={index}
                            className="bg-purple-50 p-3 rounded-lg"
                          >
                            <p
                              className={`text-gray-700 ${
                                isRTL ? "text-right" : "text-left"
                              }`}
                            >
                              {method}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Functional Contribution */}
                    <div>
                      <h4
                        className={`font-semibold text-gray-800 mb-2 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.functionalContribution}
                      </h4>
                      <p
                        className={`text-gray-700 font-medium ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {getText(rec.contribution, language)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
