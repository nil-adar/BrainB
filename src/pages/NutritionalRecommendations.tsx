import { Search, Bell, UserCircle, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSettings } from "@/components/SettingsContext"; // הוספנו את זה!
import { LanguageToggle } from "@/components/LanguageToggle";

const translations = {
  en: {
    title: "Nutritional Recommendations",
    search: "Search",
    greeting: "Good morning",
    home: "Home",
    recommendations: "Recommendations",
    back: "Back",
    loading: "Loading recommendations...",
    noRecommendations: "No nutritional recommendations found.",
    importantNote: "Important to remember:",
    disclaimer:
      "Any dietary change should be made gradually and in consultation with a doctor or dietitian. Results may vary between different children.",
    difficulty: "Difficulty Description:",
    recommendation: "Recommendation:",
    examples: "Examples:",
    contribution: "Contribution:",
    recommended: "Recommended",
    avoid: "Avoid",
  },
  he: {
    title: "המלצות תזונה",
    search: "חיפוש",
    greeting: "בוקר טוב",
    home: "דף הבית",
    recommendations: "המלצות",
    back: "חזרה",
    loading: "טוען המלצות...",
    noRecommendations: "לא נמצאו המלצות תזונתיות.",
    importantNote: "חשוב לזכור:",
    disclaimer:
      "כל שינוי תזונתי צריך להיעשות בהדרגה ובהתייעצות עם רופא או דיאטנית. התוצאות עשויות להשתנות בין ילדים שונים.",
    difficulty: "תיאור הקושי:",
    recommendation: "המלצה:",
    examples: "דוגמאות:",
    contribution: "תרומה:",
    recommended: "מומלץ",
    avoid: "להימנע",
  },
};

interface Recommendation {
  _id: string;
  difficulty_description: { en: string; he: string };
  recommendation: { en: string; he: string };
  example: { en: string[] | string; he: string[] | string };
  contribution: { en: string; he: string };
  tags?: string[];
  category?: string;
  catagory?: { en: string; he: string };
}

const getText = (
  field: string | { he: string; en: string } | undefined,
  lang: "he" | "en"
) => {
  if (!field) return "-";
  if (typeof field === "string") return field;
  return field[lang] ?? "-";
};

export default function NutritionalRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("");

  // שימוש ב-useSettings במקום document.documentElement.dir
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

  // If still no studentId, try other common patterns
  if (!studentId) {
    // Try to find any ID-like string in the URL
    const idMatch = location.pathname.match(/\/([a-fA-F0-9]{24})\//);
    if (idMatch) {
      studentId = idMatch[1];
    }
  }

  useEffect(() => {
    console.log("🔍 NutritionalRecommendations useEffect started");
    console.log("📍 Current location:", location);
    console.log("🆔 Student ID from params:", studentId);
    console.log("🌍 Current language:", language); // נוסף debug

    const loadRecommendations = async () => {
      try {
        console.log("🚀 Starting to load recommendations...");

        // If no studentId, try to get it from different sources
        let finalStudentId = studentId;
        if (!finalStudentId) {
          // Try to get from URL path
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

        // Filter only nutritional recommendations
        const allRecs = data.recommendations || [];
        console.log("📊 Total recommendations:", allRecs.length);

        const nutritionalRecs = allRecs.filter((rec: any) => {
          const category =
            rec.category || rec.catagory?.[language] || rec.catagory?.en || "";
          const isNutritional =
            category.toLowerCase().includes("nutrition") ||
            category.toLowerCase().includes("תזונה") ||
            rec.type === "nutrition";

          console.log("🔍 Checking rec:", {
            id: rec._id,
            category,
            type: rec.type,
            isNutritional,
            difficulty_desc: rec.difficulty_description?.[language], // נוסף debug
            recommendation_text: rec.recommendation?.[language], // נוסף debug
          });

          return isNutritional;
        });

        console.log(
          "🥑 Nutritional recommendations found:",
          nutritionalRecs.length
        );
        console.log(
          "🥑 Sample recommendation text:",
          nutritionalRecs[0]?.recommendation?.[language]
        );
        setRecommendations(nutritionalRecs);
      } catch (error) {
        console.error("❌ Failed to load nutritional recommendations:", error);
        // הסרנו את הנתונים המדומים כפי שביקשת
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    const loadStudentName = async () => {
      let finalStudentId = studentId;
      if (!finalStudentId) {
        const pathParts = location.pathname.split("/");
        const studentIndex = pathParts.indexOf("student");
        if (studentIndex !== -1 && pathParts[studentIndex + 1]) {
          finalStudentId = pathParts[studentIndex + 1];
        }
      }

      if (!finalStudentId) {
        setStudentName("Student");
        return;
      }

      try {
        const response = await fetch(`/api/users/${finalStudentId}`);
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
  }, [studentId, language, location]); // הוספנו language ל-dependency array

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: studentName || "Student", href: `/student/${studentId}` },
    {
      label: t.recommendations,
      href: `/recommendations?studentId=${studentId}`,
    },
    { label: t.title },
  ];

  const formatExamples = (examples: string[] | string): string => {
    if (Array.isArray(examples)) {
      return examples.join(", ");
    }
    return examples;
  };

  const getRecommendationType = (
    rec: Recommendation
  ): "recommended" | "avoid" => {
    const tags = rec.tags || [];
    const recText = rec.recommendation[language].toLowerCase();

    if (
      tags.some((tag) => tag.includes("avoid")) ||
      recText.includes("avoid") ||
      recText.includes("להימנע")
    ) {
      return "avoid";
    }
    return "recommended";
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
              <img
                src="/lovable-uploads/8408577d-8175-422f-aaff-2bc2788f66e3.png"
                alt="BrainBridge Logo"
                className="h-12 w-auto"
              />
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
              <div className="text-4xl">🥑</div>
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
            {`${t.greeting}${studentName ? `, ${studentName}` : ""}`}
          </h2>
        </div>

        {/* Important Note */}
        <div
          className={`bg-green-50 border border-green-200 rounded-lg p-4 mb-8`}
        >
          <div
            className={`flex items-start gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Info className="h-5 w-5 text-green-600 mt-0.5" />
            <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
              <h3
                className={`font-semibold text-green-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.importantNote}
              </h3>
              <p
                className={`text-grey-400 text-sm ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div
            className={`bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div>
              <strong>Debug Info:</strong>
            </div>
            <div>Student ID: {studentId || "undefined"}</div>
            <div>Location: {location.pathname}</div>
            <div>Search: {location.search}</div>
            <div>Full URL: {window.location.href}</div>
            <div>Language: {language}</div>
            <div>Recommendations: {recommendations.length}</div>
            <div>Loading: {loading.toString()}</div>
            <div>
              Sample recommendation:{" "}
              {JSON.stringify(recommendations[0]?.recommendation, null, 2)}
            </div>
            <Button
              onClick={() =>
                navigate(
                  `/nutritional-recommendations?studentId=68049245b67e1cc4d080bfc25`
                )
              }
              className="mt-2 text-xs"
              variant="outline"
            >
              Test with Sample Student ID
            </Button>
          </div>
        )}

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

        {/* Recommendations Grid */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const type = getRecommendationType(rec);
              const isAvoid = type === "avoid";

              return (
                <Card
                  key={rec._id}
                  className={`overflow-hidden ${
                    isAvoid ? "border-red-200" : ""
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {/* Header */}
                  <div
                    className={`p-4 ${isAvoid ? "bg-red-50" : "bg-green-50"} ${
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
                        <div className="w-8 h-8 bg-green-100 rounded border border-green-300 flex items-center justify-center">
                          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              ✓
                            </span>
                          </div>
                        </div>

                        <h3
                          className={`text-xl font-bold text-gray-800 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {getText(rec.recommendation, language).split(".")[0]}
                        </h3>
                      </div>
                      <div className={`${isRTL ? "mr-auto" : "ml-auto"}`}>
                        <Badge
                          variant={isAvoid ? "destructive" : "default"}
                          className={
                            isAvoid
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }
                        >
                          {isAvoid ? t.avoid : t.recommended}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent
                    className={`p-6 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {/* Difficulty Description */}
                    <div className="mb-4">
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
                    <div className="mb-4">
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

                    {/* Examples */}
                    <div className="mb-4">
                      <h4
                        className={`font-semibold text-gray-800 mb-2 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.examples}
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p
                          className={`text-gray-700 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {formatExamples(rec.example[language])}
                        </p>
                      </div>
                    </div>

                    {/* Contribution */}
                    <div>
                      <h4
                        className={`font-semibold text-gray-800 mb-2 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.contribution}
                      </h4>
                      <p
                        className={`text-gray-700 ${
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
