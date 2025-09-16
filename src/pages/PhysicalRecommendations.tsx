import {
  Search,
  Bell,
  UserCircle,
  ArrowLeft,
  Info,
  Clock,
  Activity,
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
import RecommendationToggle from "@/components/RecommendationToggle";

/**
 * PhysicalActivityRecommendations.tsx
 *
 * Displays physical activity recommendations for a specific student.
 *
 * 🔍 Responsibilities:
 * - Loads and filters recommendations of type/category "physical activity"
 * - Displays per-recommendation details: difficulty, duration, intensity, examples, functional contribution
 * - Handles multi-type diagnostic filtering (main vs. both)
 * - Adapts layout and text based on language (Hebrew/English) and user role (student, parent, teacher)
 *
 * 🌐 Localization: RTL/LTR support for Hebrew and English
 * 📦 UI: ShadCN components, Lucide icons, custom toggles and layout
 */

const getCategoryText = (
  cat:
    | [string, string]
    | string[]
    | string
    | { en: string; he: string }
    | undefined,
  lang: "he" | "en"
): string => {
  if (!cat) return "";

  if (typeof cat === "string") return cat.trim();
  if (!Array.isArray(cat)) {
    const s = (cat[lang] || cat.en || cat.he || "").trim();
    return s;
  }

  const isHeb = (s: string) => /[\u0590-\u05FF]/.test(s);
  const trimmed = cat
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);

  if (lang === "he") {
    return trimmed.find(isHeb) || trimmed[1] || trimmed[0] || "";
  } else {
    return trimmed.find((s) => !isHeb(s)) || trimmed[0] || trimmed[1] || "";
  }
};

const translations = {
  en: {
    title: "Physical Activity Recommendations",
    search: "Search",
    greeting: "Good morning",
    home: "Home",
    recommendations: "Recommendations",
    back: "Back",
    loading: "Loading recommendations...",
    noRecommendations: "No physical activity recommendations found.",
    importantNote: "Important to remember:",
    disclaimer:
      "Start gradually and adjust the activity level to the child's physical fitness. Activity intensity and duration will vary according to the child's age and abilities.",
    difficulty: "Difficulty Description:",
    activityExamples: "Activity Examples:",
    functionalContribution: "Functional Contribution:",
    minutes: "minutes",
    intensity: "Intensity:",
    duration: "Duration:",
    moderate: "Moderate",
    high: "High",
    low: "Low",
    combined: "Combined",
    Hyperactivity: "Hyperactivity",
    Inattention: "Inattention",
    unidentifiedUser: "Unidentified User",
    viewingAsParent: "Viewing as Parent for",
    viewingAsTeacher: "Viewing as Teacher for",
  },
  he: {
    title: "המלצות פעילות גופנית",
    search: "חיפוש",
    greeting: "בוקר טוב",
    home: "דף הבית",
    recommendations: "המלצות",
    back: "חזרה",
    loading: "טוען המלצות...",
    noRecommendations: "לא נמצאו המלצות פעילות גופנית.",
    importantNote: "חשוב לזכור:",
    disclaimer:
      "התחילו בהדרגה והתאימו את רמת הפעילות לכושר הגופני של הילד. עצימות ומשך הפעילות ישתנו בהתאם לגיל ויכולות הילד.",
    difficulty: "תיאור הקושי:",
    activityExamples: "דוגמאות פעילות:",
    functionalContribution: "תרומה פונקציונלית:",
    minutes: "דקות",
    intensity: "עצימות:",
    duration: "משך:",
    moderate: "בינוני",
    high: "גבוה",
    low: "נמוך",
    combined: "משולב",
    Hyperactivity: "היפראקטיבי",
    Inattention: "קשב",
    unidentifiedUser: "👤 משתמש לא מזוהה",
    viewingAsParent: "👨‍👧 הנך צופה כהורה עבור",
    viewingAsTeacher: "🧑‍🏫 הנך צופה כמורה עבור",
  },
};
type Translated = { en: string; he: string };

interface Recommendation {
  _id: string;
  difficulty_description: Translated;
  recommendation: Translated;
  example: { en: string[] | string; he: string[] | string };
  contribution: Translated;
  tags?: string[];
  category?: [string, string] | string[] | string | { en: string; he: string };
  duration?: number;
  intensity?: string;
}

const getText = (
  field: string | { he: string; en: string } | undefined,
  lang: "he" | "en"
) => {
  if (!field) return "-";
  if (typeof field === "string") return field;
  return field[lang] ?? "-";
};

export default function PhysicalActivityRecommendations() {
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

  const [userPreference, setUserPreference] = useState<"main" | "both" | null>(
    null
  );
  const [hasMultipleTypes, setHasMultipleTypes] = useState(false);
  const [recommendationData, setRecommendationData] = useState<any>(null);

  useEffect(() => {
    const loadSavedPreference = async () => {
      const savedPreference = sessionStorage.getItem(
        "recommendationPreference"
      ) as "main" | "both" | null;

      if (savedPreference && studentId) {
        setUserPreference(savedPreference);
        try {
          const queryParams = new URLSearchParams({
            lang: language,
          });

          if (savedPreference) {
            queryParams.append("view", savedPreference);
          }

          const response = await fetch(
            `/api/recommendations/${studentId}?${queryParams.toString()}`
          );

          if (response.ok) {
            const data = await response.json();
            setRecommendationData(data);
            setHasMultipleTypes(
              data.multipleTypes && data.subTypes?.length > 0
            );

            // סנן רק המלצות פעילות גופנית מהנתונים המסוננים
            const allRecs = data.recommendations || [];
            const physicalRecs = allRecs.filter((rec: any) => {
              const category =
                rec.category ||
                rec.category?.[language] ||
                rec.category?.en ||
                "";
              return (
                category.toLowerCase().includes("physical") ||
                category.toLowerCase().includes("גופנית") ||
                rec.type === "physical"
              );
            });

            console.log(
              "🏃‍♂️ Physical recommendations with filtering:",
              physicalRecs.length
            );
            setRecommendations(physicalRecs);
          }
        } catch (error) {
          console.error("Failed to load recommendation data:", error);
        }
      }
    };

    loadSavedPreference();
  }, [studentId, language]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setLoggedUserId(localUser._id || null);
    setViewerRole(localUser.role || null);
  }, []);

  useEffect(() => {
    console.log("🏃‍♂️ Physical Activity Recommendations useEffect started");
    console.log("📍 Current location:", location);
    console.log("🆔 Student ID:", studentId);
    console.log("🌍 Current language:", language);

    const loadRecommendations = async () => {
      try {
        console.log("🚀 Starting to load physical recommendations...");
        const savedPreference = sessionStorage.getItem(
          "recommendationPreference"
        ) as "main" | "both" | null;
        if (!studentId) {
          console.log("❌ No studentId found");
          setRecommendations([]);
          return;
        }
        console.log("📡 Fetching recommendations for student:", studentId);

        const queryParams = new URLSearchParams({
          lang: language,
        });

        if (savedPreference) {
          queryParams.append("view", savedPreference);
        }

        const response = await fetch(
          `/api/recommendations/${studentId}?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Raw data received:", data);

        // Filter only physical activity recommendations from the already filtered data
        const allRecs = data.recommendations || [];
        const physicalRecs = allRecs.filter((rec: any) => {
          const category =
            rec.category || rec.category?.[language] || rec.category?.en || "";
          const isPhysical =
            category.toLowerCase().includes("physical") ||
            category.toLowerCase().includes("גופנית") ||
            rec.type === "physical";

          return isPhysical;
        });

        console.log("🏃‍♂️ Physical recommendations found:", physicalRecs.length);
        console.log(
          "🏃‍♂️ Sample recommendation text:",
          physicalRecs[0]?.recommendation?.[language]
        );
        setRecommendations(physicalRecs);
      } catch (error) {
        console.error("❌ Failed to load physical recommendations:", error);
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

  const formatExamples = (examples: string[] | string): string[] => {
    if (Array.isArray(examples)) {
      return examples;
    }
    return [examples];
  };

  const getIntensityColor = (intensity: string | undefined): string => {
    if (!intensity) return "bg-gray-100 text-gray-800";

    const intensityLower = intensity.toLowerCase();
    if (intensityLower.includes("high") || intensityLower.includes("גבוה"))
      return "bg-red-100 text-red-800";
    if (
      intensityLower.includes("moderate") ||
      intensityLower.includes("בינוני")
    )
      return "bg-yellow-100 text-yellow-800";
    if (intensityLower.includes("low") || intensityLower.includes("נמוך"))
      return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const getDifficultyTags = (
    tags: string[] = [],
    intensity: string | undefined
  ): string[] => {
    const result = [];

    if (intensity) {
      result.push(intensity);
    }

    tags.forEach((tag) => {
      if (tag.includes("combined")) result.push(isRTL ? "משולב" : "Combined");
      if (tag.includes("Hyperactivity"))
        result.push(isRTL ? "היפראקטיבי" : "Hyperactivity");
      if (tag.includes("Inattention"))
        result.push(isRTL ? "קשב" : "Inattention");
    });

    return result;
  };

  const getGreetingTitle = () => {
    if (!viewerRole || !studentId || !studentName) return t.unidentifiedUser;

    const isSelf = String(loggedUserId) === String(studentId);

    if (viewerRole === "student" && isSelf) {
      return `${t.greeting} ${studentName}`;
    }

    if (viewerRole === "parent") {
      return `${t.greeting} ${t.viewingAsParent} ${studentName}`;
    }

    if (viewerRole === "teacher") {
      return `${t.greeting} ${t.viewingAsTeacher} ${studentName}`;
    }

    return t.unidentifiedUser;
  };

  return (
    <div>
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
            {/*            
            <div className="mt-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>*/}
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
                <Activity className="h-8 w-8 text-blue-600" />
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

          {/* Greeting - Updated to use the new function */}
          <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            <h2
              className={`text-2xl font-semibold text-gray-700 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {getGreetingTitle()}
            </h2>
          </div>

          {hasMultipleTypes && userPreference && recommendationData && (
            <RecommendationToggle
              language={language}
              mainType={recommendationData.mainType || ""}
              subTypes={recommendationData.subTypes || []}
              currentSelection={userPreference}
              readonly={true}
            />
          )}

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div
              className={`flex items-start gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
                <h3
                  className={`font-semibold text-blue-900 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.importantNote}
                </h3>
                <p
                  className={`text-blue-800 text-sm ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.disclaimer}
                </p>
              </div>
            </div>
          </div>

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
                className="bg-blue-600 hover:bg-blue-700"
              >
                Back to Recommendations
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p
                className={`text-gray-600 ${
                  isRTL ? "text-right" : "text-left"
                }`}
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
                className={`text-gray-600 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.noRecommendations}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {!loading && recommendations.length > 0 && (
            <div className="space-y-6">
              {recommendations.map((rec) => {
                const examples = formatExamples(rec.example[language]);
                const difficultyTags = getDifficultyTags(
                  rec.tags,
                  rec.intensity
                );

                return (
                  <Card
                    key={rec._id}
                    className={`overflow-hidden ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {/* Header */}
                    <div
                      className={`bg-slate-400 p-4 text-white ${
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
                          <Activity className="h-6 w-6" />
                          <h3
                            className={`text-xl font-bold ${
                              isRTL ? "text-right" : "text-left"
                            }`}
                          >
                            {getText(rec.recommendation, language)}
                          </h3>
                        </div>
                        <div
                          className={`flex gap-2 ${
                            isRTL ? "mr-auto" : "ml-auto"
                          }`}
                        >
                          {difficultyTags.map((tag, index) => (
                            <Badge
                              key={index}
                              className={getIntensityColor(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
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

                      {/* Duration and Intensity */}
                      {(rec.duration || rec.intensity) && (
                        <div
                          className={`flex gap-6 mb-6 ${
                            isRTL ? "flex-row-reverse justify-end" : ""
                          }`}
                        >
                          {rec.duration && (
                            <div
                              className={`flex items-center gap-2 text-gray-700 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {rec.duration} {t.minutes}
                              </span>
                            </div>
                          )}
                          {rec.intensity && (
                            <div
                              className={`flex items-center gap-2 text-gray-700 ${
                                isRTL ? "flex-row-reverse" : ""
                              }`}
                            >
                              <Activity className="h-4 w-4" />
                              <span className="font-medium">
                                {t.intensity} {rec.intensity}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Activity Examples */}
                      <div className="mb-6">
                        <h4
                          className={`font-semibold text-gray-800 mb-3 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t.activityExamples}
                        </h4>
                        <div className="space-y-2">
                          {examples.map((example, index) => (
                            <div
                              key={index}
                              className="bg-blue-50 p-3 rounded-lg"
                            >
                              <p
                                className={`text-gray-700 ${
                                  isRTL ? "text-right" : "text-left"
                                }`}
                              >
                                {example}
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
    </div>
  );
}
