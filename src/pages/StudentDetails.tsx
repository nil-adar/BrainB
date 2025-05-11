
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const translations = {
  en: {
    back: "Back",
    class: "Class",
    latestAssessments: "Latest Assessments",
    readingTest: "Reading Test",
    comprehensionTest: "Reading Comprehension Test",
    score: "Score",
    dailyTasks: "Daily Tasks",
    guidedReading: "Guided Reading",
    minutes: "minutes of guided reading",
    comprehensionPractice: "Comprehension Practice",
    exercises: "exercises",
    home: "Home",
    studentProfile: "Student Profile"
  },
  he: {
    back: "חזור",
    class: "כיתה",
    latestAssessments: "הערכות אחרונות",
    readingTest: "מבחן קריאה",
    comprehensionTest: "מבחן הבנת הנקרא",
    score: "ציון",
    dailyTasks: "משימות יומיות",
    guidedReading: "קריאה מודרכת",
    minutes: "דקות של קריאה מודרכת",
    comprehensionPractice: "תרגול הבנת הנקרא",
    exercises: "תרגילים",
    home: "דף הבית",
    studentProfile: "פרופיל תלמיד"
  }
};

const StudentDetails = () => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: t.studentProfile },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="תמונת תלמיד"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">אליאנה כהן</h1>
            <p className="text-gray-600">{t.class} ד׳</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">{t.latestAssessments}</h2>
            <div className="space-y-3">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.readingTest}</span>
                  <span className="text-gray-600">15.03.2024</span>
                </div>
                <p className="mt-2 text-gray-600">{t.score}: 85/100</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.comprehensionTest}</span>
                  <span className="text-gray-600">10.03.2024</span>
                </div>
                <p className="mt-2 text-gray-600">{t.score}: 92/100</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">{t.dailyTasks}</h2>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t.guidedReading}</h3>
                <p className="text-gray-600">20 {t.minutes}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">{t.comprehensionPractice}</h3>
                <p className="text-gray-600">2 {t.exercises}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
