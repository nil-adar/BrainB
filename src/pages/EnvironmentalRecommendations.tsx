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

export default function EnvironmentalRecommendations() {
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

  useEffect(() => {
    console.log("🏠 Environmental Recommendations useEffect started");
    console.log("📍 Current location:", location);
    console.log("🆔 Student ID:", studentId);

    const loadRecommendations = async () => {
      try {
        console.log("🚀 Starting to load environmental recommendations...");

        if (!studentId) {
          console.log("❌ No studentId found, using mock data");
          setMockData();
          setLoading(false);
          return;
        }

        console.log("📡 Fetching recommendations for student:", studentId);
        const response = await fetch(
          `/api/recommendations/${studentId}?lang=${language}`
        );
        console.log("📬 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Raw data received:", data);

        // Filter only environmental recommendations
        const allRecs = data.recommendations || [];
        console.log("📊 Total recommendations:", allRecs.length);

        const environmentalRecs = allRecs.filter((rec: any) => {
          const category =
            rec.category || rec.catagory?.[language] || rec.catagory?.en || "";
          const isEnvironmental =
            category.toLowerCase().includes("environmental") ||
            category.toLowerCase().includes("סביבתי") ||
            category.toLowerCase().includes("environment") ||
            rec.type === "environmental";

          console.log("🔍 Checking rec:", {
            id: rec._id,
            category,
            type: rec.type,
            isEnvironmental,
          });

          return isEnvironmental;
        });

        console.log(
          "🏠 Environmental recommendations found:",
          environmentalRecs.length
        );

        if (environmentalRecs.length === 0) {
          setMockData();
        } else {
          setRecommendations(environmentalRecs);
        }
      } catch (error) {
        console.error(
          "❌ Failed to load environmental recommendations:",
          error
        );
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    const setMockData = () => {
      console.log("🎭 Using mock data for environmental recommendations");
      const mockRecommendations = [
        {
          _id: "mock1",
          difficulty_description: {
            en: "Difficulty in organizing and responding to instructions",
            he: "קושי בארגון ובמענה להוראות",
          },
          recommendation: {
            en: "Use visual schedules and daily auditory reminders",
            he: "השתמש בלוחות זמנים ויזואליים ותזכורות קוליות יומיות",
          },
          example: {
            en: [
              "Place a clear visual schedule on the child's desk",
              "Play a voice memo each morning reviewing the day's routine",
            ],
            he: [
              "הניחו לוח זמנים ויזואלי ברור על שולחן הילד",
              "השמיעו הודעה קולית כל בוקר הסוקרת את שגרת היום",
            ],
          },
          contribution: {
            en: "Improves task initiation, supports time management and reduces forgetfulness",
            he: "משפר התחלת משימות, תומך בניהול זמן ומפחית שכחה",
          },
          implementation_methods: {
            en: [
              "Place a clear visual schedule on the child's desk",
              "Play a voice memo each morning reviewing the day's routine",
            ],
            he: [
              "הניחו לוח זמנים ויזואלי ברור על שולחן הילד",
              "השמיעו הודעה קולית כל בוקר הסוקרת את שגרת היום",
            ],
          },
          tags: ["visual", "combined"],
          category: "environmental",
          icon: "eye",
        },
        {
          _id: "mock2",
          difficulty_description: {
            en: "Difficulty organizing materials and learning tools",
            he: "קושי בארגון חומרים וכלי למידה",
          },
          recommendation: {
            en: "Create an organized learning environment free from distractions",
            he: "יצרו סביבת למידה מאורגנת נקייה מהסחות דעת",
          },
          example: {
            en: [
              "Place notebooks and writing tools in fixed, labeled locations",
              "Use boxes or drawers with clear labels",
              "Remove unnecessary items from the study desk",
            ],
            he: [
              "הניחו מחברות וכלי כתיבה במקומות קבועים ומסומנים",
              "השתמשו בקופסאות או מגירות עם תוויות ברורות",
              "הסירו פריטים מיותרים משולחן הלמידה",
            ],
          },
          contribution: {
            en: "Reduces anxiety, improves concentration and facilitates navigation",
            he: "מפחית חרדה, משפר ריכוז ומקל על ניווט",
          },
          implementation_methods: {
            en: [
              "Place notebooks and writing tools in fixed, labeled locations",
              "Use boxes or drawers with clear labels",
              "Remove unnecessary items from the study desk",
            ],
            he: [
              "הניחו מחברות וכלי כתיבה במקומות קבועים ומסומנים",
              "השתמשו בקופסאות או מגירות עם תוויות ברורות",
              "הסירו פריטים מיותרים משולחן הלמידה",
            ],
          },
          tags: ["organization", "combined"],
          category: "environmental",
          icon: "home",
        },
        {
          _id: "mock3",
          difficulty_description: {
            en: "Difficulty maintaining attention because attention and time management",
            he: "קושי בשמירה על קשב בגלל חוסר ניהול קשב וזמן",
          },
          recommendation: {
            en: "Establish fixed and repetitive daily routines",
            he: "קבעו שגרות יומיות קבועות וחוזרות",
          },
          example: {
            en: [
              "Morning routine: wake-up, breakfast, bag preparation in the same order every day",
              "Evening routine: homework, dinner, sleep preparations",
              "Use a timer to mark transitions between activities",
            ],
            he: [
              "שגרת בוקר: התעוררות, ארוחת בוקר, הכנת תיק באותו סדר כל יום",
              "שגרת ערב: שיעורי בית, ארוחת ערב, הכנות לשינה",
              "השתמשו בטיימר לסימון מעברים בין פעילויות",
            ],
          },
          contribution: {
            en: "Reduces anxiety, improves self-confidence and sense of control",
            he: "מפחית חרדה, משפר ביטחון עצמי ותחושת שליטה",
          },
          implementation_methods: {
            en: [
              "Morning routine: wake-up, breakfast, bag preparation in the same order every day",
              "Evening routine: homework, dinner, sleep preparations",
              "Use a timer to mark transitions between activities",
            ],
            he: [
              "שגרת בוקר: התעוררות, ארוחת בוקר, הכנת תיק באותו סדר כל יום",
              "שגרת ערב: שיעורי בית, ארוחת ערב, הכנות לשינה",
              "השתמשו בטיימר לסימון מעברים בין פעילויות",
            ],
          },
          tags: ["routine", "combined"],
          category: "environmental",
          icon: "brain",
        },
        {
          _id: "mock4",
          difficulty_description: {
            en: "Difficulty focusing in the presence of external stimuli",
            he: "קושי בריכוז בנוכחות גירויים חיצוניים",
          },
          recommendation: {
            en: "Reduce external stimuli and create a quiet environment",
            he: "הפחיתו גירויים חיצוניים ויצרו סביבה שקטה",
          },
          example: {
            en: [
              "Use noise-canceling headphones during study time",
              "Facing activity homework, sitting with regular intervals",
              "Use a timer to mark transitions between activities",
            ],
            he: [
              "השתמשו באוזניות מבטלות רעש במהלך זמן הלמידה",
              "פנו לפעילות שיעורי בית, ישיבה עם הפסקות קבועות",
              "השתמשו בטיימר לסימון מעברים בין פעילויות",
            ],
          },
          contribution: {
            en: "Reduces external distractions, improves focus and concentration",
            he: "מפחית הסחות דעת חיצוניות, משפר פוקוס וריכוז",
          },
          implementation_methods: {
            en: [
              "Use noise-canceling headphones during study time",
              "Facing activity homework, sitting with regular intervals",
              "Use a timer to mark transitions between activities",
            ],
            he: [
              "השתמשו באוזניות מבטלות רעש במהלך זמן הלמידה",
              "פנו לפעילות שיעורי בית, ישיבה עם הפסקות קבועות",
              "השתמשו בטיימר לסימון מעברים בין פעילויות",
            ],
          },
          tags: ["sensory", "environment"],
          category: "environmental",
          icon: "headphones",
        },
      ];

      setRecommendations(mockRecommendations);
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
    if (tagLower.includes("visual")) return "bg-purple-100 text-purple-800";
    if (tagLower.includes("organization")) return "bg-green-100 text-green-800";
    if (tagLower.includes("routine")) return "bg-blue-100 text-blue-800";
    if (tagLower.includes("sensory")) return "bg-yellow-100 text-yellow-800";
    if (tagLower.includes("environment"))
      return "bg-orange-100 text-orange-800";
    if (tagLower.includes("combined")) return "bg-gray-100 text-gray-800";
    return "bg-purple-100 text-purple-800";
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
            <Home className="h-8 w-8 text-purple-600" />
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
            <div>Language: {language}</div>
            <div>Recommendations: {recommendations.length}</div>
            <div>Loading: {loading.toString()}</div>
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Recommendations
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t.loading}</p>
          </div>
        )}

        {/* No Recommendations State */}
        {!loading && recommendations.length === 0 && studentId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <p className="text-gray-600">{t.noRecommendations}</p>
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
                <Card key={rec._id} className="overflow-hidden">
                  {/* Header */}
                  <div className="bg-purple-400 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIconByType(rec.icon)}
                        <h3 className="text-xl font-bold">
                          {rec.recommendation[language]}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {tags.map((tag, index) => (
                          <Badge key={index} className={getTagColor(tag)}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Difficulty Description */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.difficulty}
                      </h4>
                      <p className="text-gray-600">
                        {rec.difficulty_description[language]}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.recommendation}
                      </h4>
                      <p className="text-gray-700">
                        {rec.recommendation[language]}
                      </p>
                    </div>

                    {/* Implementation Methods */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {t.implementationMethods}
                      </h4>
                      <div className="space-y-2">
                        {implementationMethods.map((method, index) => (
                          <div
                            key={index}
                            className="bg-purple-50 p-3 rounded-lg"
                          >
                            <p className="text-gray-700">{method}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Functional Contribution */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {t.functionalContribution}
                      </h4>
                      <p className="text-gray-700 font-medium">
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
