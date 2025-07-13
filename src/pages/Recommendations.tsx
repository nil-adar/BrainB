import {
  Search,
  Bell,
  UserCircle,
  Users,
  BookOpen,
  Activity,
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

const translations = {
  en: {
    title: "Recommendations",
    nutritionalAdvice: "Nutritional Advice",
    physicalActivity: "Physical Activity Suggestions",
    environmentalModifications: "Environmental Modifications",
    formalRecommendations: "Formal recommendations file:",
    greeting: "Good morning",
    viewRecommendations: "View recommendations",
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
  },
};

export default function Recommendations() {
  interface RecommendationStatus {
    studentFormCompleted: boolean;
    parentFormCompleted: boolean;
    teacherFormCompleted: boolean;
    diagnosisCompleted: boolean;
  }

  const [status, setStatus] = useState<RecommendationStatus | null>(null);
  const { language } = useSettings();
  const t = translations[language];
  const isRTL = language === "he";
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const studentId = params.get("studentId");

  const [studentName, setStudentName] = useState<string>("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    // טען המלצות מסוננות
    fetch(`/api/recommendations/${studentId}?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        const recs = data.recommendations || [];
        setRecommendations(recs);

        console.log("✅ Recommendations fetched:", recs.length);
      })
      .catch((err) => {
        console.error("❌ Failed to load recommendations:", err);
      });

    // טען סטטוס טפסים
    fetch(`/api/forms/check-status/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((err) => {
        console.error("❌ Failed to load recommendation status:", err);
      });

    // טען שם תלמיד
    fetch(`/api/users/${studentId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("📦 student data:", res);

        const user = res.data;

        if (user.firstName && user.lastName) {
          setStudentName(`${user.firstName} ${user.lastName}`);
        } else if (user.name) {
          setStudentName(user.name);
        } else {
          setStudentName("תלמיד");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load student name:", err);
        setStudentName("תלמיד");
      });
  }, [studentId, language]); // הוספנו language ל-dependency array

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: studentName || "תלמיד", href: `/student/${studentId}` },
    { label: t.title },
  ];

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
            </div>
            <div
              className={`flex items-center gap-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
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
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {`${t.greeting}${studentName ? ` ${studentName}` : ""}`}
          </h1>
          <h2
            className={`text-2xl font-semibold text-gray-700 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {/*t.title*/}
          </h2>
        </div>

        {status &&
          (!status.studentFormCompleted ||
            !status.parentFormCompleted ||
            !status.teacherFormCompleted ||
            !status.diagnosisCompleted) && (
            <div
              className={`bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md p-4 mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`font-semibold mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                כדי להציג את ההמלצות המלאות, יש להשלים את:
              </p>
              <ul
                className={`list-disc ${
                  isRTL ? "list-inside text-right" : "list-inside text-left"
                }`}
              >
                {!status.studentFormCompleted && <li>שאלון תלמיד</li>}
                {!status.parentFormCompleted && <li>שאלון הורה</li>}
                {!status.teacherFormCompleted && <li>שאלון מורה</li>}
                {!status.diagnosisCompleted && <li>אבחון נודוס</li>}
              </ul>
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
              lang={language}
              isLoading={!studentId || recommendations.length === 0}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
