import { Search, Bell, UserCircle, ArrowLeft, Info, Clock, Activity } from "lucide-react";
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
    title: "Physical Activity Recommendations",
    search: "Search",
    greeting: "Good morning",
    home: "Home",
    recommendations: "Recommendations",
    back: "Back",
    loading: "Loading recommendations...",
    noRecommendations: "No physical activity recommendations found.",
    importantNote: "Important to remember:",
    disclaimer: "Start gradually and adjust the activity level to the child's physical fitness. Activity intensity and duration will vary according to the child's age and abilities.",
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
    hyperactive: "Hyperactive",
    inattentive: "Inattentive"
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
    disclaimer: "התחילו בהדרגה והתאימו את רמת הפעילות לכושר הגופני של הילד. עצימות ומשך הפעילות ישתנו בהתאם לגיל ויכולות הילד.",
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
    hyperactive: "היפראקטיבי",
    inattentive: "קשב"
  }
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
  duration?: number;
  intensity?: string;
}

export default function PhysicalActivityRecommendations() {
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
    const pathParts = location.pathname.split('/');
    const studentIndex = pathParts.indexOf('student');
    if (studentIndex !== -1 && pathParts[studentIndex + 1]) {
      studentId = pathParts[studentIndex + 1];
    }
  }

  useEffect(() => {
    console.log("🏃‍♂️ Physical Activity Recommendations useEffect started");
    console.log("📍 Current location:", location);
    console.log("🆔 Student ID:", studentId);
    
    const loadRecommendations = async () => {
      try {
        console.log("🚀 Starting to load physical recommendations...");
        
        if (!studentId) {
          console.log("❌ No studentId found, using mock data");
          setMockData();
          setLoading(false);
          return;
        }
        
        console.log("📡 Fetching recommendations for student:", studentId);
        const response = await fetch(`/api/recommendations/${studentId}?lang=${language}`);
        console.log("📬 Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 Raw data received:", data);
        
        // Filter only physical activity recommendations
        const allRecs = data.recommendations || [];
        console.log("📊 Total recommendations:", allRecs.length);
        
        const physicalRecs = allRecs.filter((rec: any) => {
          const category = rec.category || rec.catagory?.[language] || rec.catagory?.en || '';
          const isPhysical = category.toLowerCase().includes('physical') || 
                           category.toLowerCase().includes('גופנית') ||
                           rec.type === 'physical';
          
          console.log("🔍 Checking rec:", {
            id: rec._id,
            category,
            type: rec.type,
            isPhysical
          });
          
          return isPhysical;
        });
        
        console.log("🏃‍♂️ Physical recommendations found:", physicalRecs.length);
        
        if (physicalRecs.length === 0) {
          setMockData();
        } else {
          setRecommendations(physicalRecs);
        }
        
      } catch (error) {
        console.error("❌ Failed to load physical recommendations:", error);
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    const setMockData = () => {
      console.log("🎭 Using mock data for physical activities");
      const mockRecommendations = [
        {
          _id: "mock1",
          difficulty_description: {
            en: "Difficulty initiating mental tasks after inactivity, trouble starting assignments",
            he: "קושי בהתחלת משימות מחשבתיות לאחר חוסר פעילות, בעיה בהתחלת מטלות"
          },
          recommendation: {
            en: "Single Bout Aerobic Exercise",
            he: "פעילות אירובית חד פעמית"
          },
          example: {
            en: ["10 minutes aerobic activity at the beginning of the day", "Jumping jacks, running in place, jump rope"],
            he: ["10 דקות פעילות אירובית בתחילת היום", "קפיצות, ריצה במקום, חבל קפיצה"]
          },
          contribution: {
            en: "Improves attention immediately, effect lasts ~60 minutes",
            he: "משפר קשב מיידית, השפעה נמשכת כ-60 דקות"
          },
          tags: ["moderate", "combined", "hyperactive"],
          category: "physical",
          duration: 10,
          intensity: "moderate"
        },
        {
          _id: "mock2",
          difficulty_description: {
            en: "Difficulty developing ideas, frequent movement and too impatient to complete fine psychomotor activities",
            he: "קושי בפיתוח רעיונות, תנועה תכופה וחוסר סבלנות להשלמת פעילויות פסיכו-מוטוריות עדינות"
          },
          recommendation: {
            en: "Motor-Cognitive Training",
            he: "אימון מוטורי-קוגניטיבי"
          },
          example: {
            en: ["Team games requiring foot-tapping and following two-step instructions", "Relay races, scavenger hunts"],
            he: ["משחקי קבוצה הדורשים תיפוף ברגל ומעקב אחר הוראות דו-שלביות", "מרוצי שליחים, ציד אוצרות"]
          },
          contribution: {
            en: "Enhances perception, regulation and mobilization",
            he: "משפר תפיסה, ויסות וגיוס"
          },
          tags: ["moderate", "combined", "hyperactive"],
          category: "physical",
          duration: 20,
          intensity: "moderate"
        },
        {
          _id: "mock3",
          difficulty_description: {
            en: "Difficulty achieving awareness and controlling impulsive actions, struggling to read their body",
            he: "קושי בהשגת מודעות ובשליטה על פעולות אימפולסיביות, מתקשה לקרוא את הגוף"
          },
          recommendation: {
            en: "Moderate-High Intensity Aerobic Training",
            he: "אימון אירובי בעצימות בינונית-גבוהה"
          },
          example: {
            en: ["Structured aerobic classes for children", "Kids' cardio, running group with regular start/stop intervals"],
            he: ["שיעורי אירובי מובנים לילדים", "קרדיו לילדים, קבוצת ריצה עם הפסקות קבועות"]
          },
          contribution: {
            en: "Improved inhibition, attention, emotional regulation and motor function",
            he: "שיפור עיכוב, קשב, ויסות רגשי ותפקוד מוטורי"
          },
          tags: ["moderate-high", "combined", "impulsive"],
          category: "physical",
          duration: 30,
          intensity: "moderate-high"
        }
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
    { label: t.recommendations, href: `/recommendations?studentId=${studentId}` },
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
    if (intensityLower.includes('high')) return "bg-red-100 text-red-800";
    if (intensityLower.includes('moderate')) return "bg-yellow-100 text-yellow-800";
    if (intensityLower.includes('low')) return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const getDifficultyTags = (tags: string[] = [], intensity: string | undefined): string[] => {
    const result = [];
    
    if (intensity) {
      result.push(intensity);
    }
    
    tags.forEach(tag => {
      if (tag.includes('combined')) result.push('Combined');
      if (tag.includes('hyperactive')) result.push('Hyperactive');
      if (tag.includes('inattentive')) result.push('Inattentive');
    });
    
    return result;
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
            <Activity className="h-8 w-8 text-blue-600" />
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
              <h3 className="font-semibold text-blue-900 mb-1">{t.importantNote}</h3>
              <p className="text-blue-800 text-sm">{t.disclaimer}</p>
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono">
            <div><strong>Debug Info:</strong></div>
            <div>Student ID: {studentId || 'undefined'}</div>
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
            <h3 className="text-xl font-semibold mb-4">Missing Student Information</h3>
            <p className="text-gray-600 mb-6">
              We need a student ID to load personalized recommendations.
            </p>
            <Button
              onClick={() => navigate('/recommendations')}
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
              const examples = formatExamples(rec.example[language]);
              const difficultyTags = getDifficultyTags(rec.tags, rec.intensity);
              
              return (
                <Card key={rec._id} className="overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-400 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="h-6 w-6" />
                        <h3 className="text-xl font-bold">
                          {rec.recommendation[language]}
                        </h3>
                      </div>
                      <div className="flex gap-2">
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

                  <CardContent className="p-6">
                    {/* Difficulty Description */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">{t.difficulty}</h4>
                      <p className="text-gray-600">{rec.difficulty_description[language]}</p>
                    </div>

                    {/* Duration and Intensity */}
                    {(rec.duration || rec.intensity) && (
                      <div className="flex gap-6 mb-6">
                        {rec.duration && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{rec.duration} {t.minutes}</span>
                          </div>
                        )}
                        {rec.intensity && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Activity className="h-4 w-4" />
                            <span className="font-medium">{t.intensity} {rec.intensity}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Activity Examples */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">{t.activityExamples}</h4>
                      <div className="space-y-2">
                        {examples.map((example, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-gray-700">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Functional Contribution */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t.functionalContribution}</h4>
                      <p className="text-gray-700 font-medium">{rec.contribution[language]}</p>
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