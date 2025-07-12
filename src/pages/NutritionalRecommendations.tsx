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

export default function NutritionalRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("");

  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];
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
          console.log("❌ No studentId found, using mock data");
          setLoading(false);
          return;
        }

        console.log("📡 Fetching recommendations for student:", finalStudentId);
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
          });

          return isNutritional;
        });

        console.log(
          "🍎 Nutritional recommendations found:",
          nutritionalRecs.length
        );
        setRecommendations(nutritionalRecs);
      } catch (error) {
        console.error("❌ Failed to load nutritional recommendations:", error);

        // Show mock data for development
        console.log("🎭 Using mock data for development");
        const mockRecommendations = [
          {
            _id: "mock1",
            difficulty_description: {
              en: "Behavioral and emotional issues, difficulty concentrating, restlessness, forgetfulness",
              he: "קשיים התנהגותיים ורגשיים, קושי בריכוז, חוסר שקט, שכחנות",
            },
            recommendation: {
              en: "Magnesium plus vitamin D supplementation reduced behavioral and emotional problems in children with ADHD",
              he: "תוסף מגנזיום יחד עם ויטמין D הפחית קשיים התנהגותיים ורגשיים בילדים עם ADHD",
            },
            example: {
              en: [
                "Almonds",
                "cashews",
                "sunflower seeds",
                "spinach",
                "Swiss chard",
                "black beans",
              ],
              he: [
                "שקדים",
                "אגוזי קשיו",
                "גרעיני חמנייה",
                "תרד",
                "מנגולד",
                "שעועית שחורה",
              ],
            },
            contribution: {
              en: "Reduces behavioral outbursts, improves mood, and stabilizes emotional regulation",
              he: "מפחית התפרצויות, משפר מצב רוח ומייצב ויסות רגשי",
            },
            tags: ["recommended"],
            category: "nutrition",
          },
          {
            _id: "mock2",
            difficulty_description: {
              en: "Poor concentration and emotional dysregulation",
              he: "קושי בריכוז וחוסר ויסות רגשי",
            },
            recommendation: {
              en: "Few-Foods diet improved symptoms in 60% of children",
              he: "דיאטת מזונות מעטים שיפרה תסמינים ב-60% מהילדים",
            },
            example: {
              en: ["Rice", "potato", "chicken", "lamb", "pear", "banana"],
              he: ["אורז", "תפוחי אדמה", "עוף", "כבש", "אגס", "בננה"],
            },
            contribution: {
              en: "Reduces behavioral outbursts and improves attention in sensitive children",
              he: "מפחית התפרצויות ומשפר קשב בילדים רגישים",
            },
            tags: ["recommended"],
            category: "nutrition",
          },
          {
            _id: "mock3",
            difficulty_description: {
              en: "Worsening hyperactivity, impulsivity, mood swings and fatigue",
              he: "החרפת היפראקטיביות, אימפולסיביות, מצבי רוח ועייפות",
            },
            recommendation: {
              en: "A diet high in processed foods may worsen ADHD symptoms",
              he: "דיאטה עשירה במזונות מעובדים עלולה להחמיר תסמיני ADHD",
            },
            example: {
              en: [
                "Fast food",
                "pizza",
                "hamburger",
                "processed schnitzel",
                "salty snacks",
                "chips",
              ],
              he: [
                "מזון מהיר",
                "פיצה",
                "המבורגר",
                "שניצל מעובד",
                "חטיפים מלוחים",
                "צ'יפס",
              ],
            },
            contribution: {
              en: "Prevents symptom worsening, supports better behavioral and emotional stability",
              he: "מונע החמרת תסמינים, תומך ביציבות התנהגותית ורגשית טובה יותר",
            },
            tags: ["avoid"],
            category: "nutrition",
          },
        ];

        console.log(
          "🎭 Setting mock recommendations:",
          mockRecommendations.length
        );
        setRecommendations(mockRecommendations);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <img
                src="/lovable-uploads/8408577d-8175-422f-aaff-2bc2788f66e3.png"
                alt="BrainBridge Logo"
                className="h-12 w-auto"
              />
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t.search}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/recommendations?studentId=${studentId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍎</div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            {`${t.greeting}${studentName ? `, ${studentName}` : ""}`}
          </h2>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                {t.importantNote}
              </h3>
              <p className="text-blue-800 text-sm">{t.disclaimer}</p>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono">
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
            <h3 className="text-xl font-semibold mb-4">
              Missing Student Information
            </h3>
            <p className="text-gray-600 mb-6">
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
            <p className="text-gray-600">{t.loading}</p>
          </div>
        )}

        {/* No Recommendations State */}
        {!loading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <p className="text-gray-600">{t.noRecommendations}</p>
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
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`p-4 ${isAvoid ? "bg-red-50" : "bg-green-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            isAvoid ? "bg-red-100" : "bg-green-100"
                          }`}
                        >
                          {isAvoid ? "⚠️" : "✅"}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {rec.recommendation[language].split(".")[0]}
                        </h3>
                      </div>
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

                  <CardContent className="p-6">
                    {/* Difficulty Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.difficulty}
                      </h4>
                      <p className="text-gray-600">
                        {rec.difficulty_description[language]}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.recommendation}
                      </h4>
                      <p className="text-gray-700">
                        {rec.recommendation[language]}
                      </p>
                    </div>

                    {/* Examples */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.examples}
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">
                          {formatExamples(rec.example[language])}
                        </p>
                      </div>
                    </div>

                    {/* Contribution */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.contribution}
                      </h4>
                      <p className="text-gray-700">
                        {rec.contribution[language]}
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
