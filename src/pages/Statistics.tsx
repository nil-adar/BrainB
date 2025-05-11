import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const translations = {
  en: {
    back: "Back",
    statistics: "Statistics",
    assessmentsByMonth: "Assessments by Month",
    progressByTopic: "Progress by Topic",
    home: "Home",
    months: {
      january: "January",
      february: "February",
      march: "March"
    },
    topics: {
      reading: "Reading",
      writing: "Writing",
      comprehension: "Reading Comprehension"
    }
  },
  he: {
    back: "חזור",
    statistics: "סטטיסטיקות",
    assessmentsByMonth: "הערכות לפי חודש",
    progressByTopic: "התקדמות לפי נושא",
    home: "דף הבית",
    months: {
      january: "ינואר",
      february: "פברואר",
      march: "מרץ"
    },
    topics: {
      reading: "קריאה",
      writing: "כתיבה",
      comprehension: "הבנת הנקרא"
    }
  }
};

const Statistics = () => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: "מיה פרץ", href: "/student/123" },
    { label: t.statistics },
  ];

  const data = [
    { name: t.months.january, assessments: 12 },
    { name: t.months.february, assessments: 19 },
    { name: t.months.march, assessments: 15 },
  ];

  const progressData = [
    { name: t.topics.reading, score: 85 },
    { name: t.topics.writing, score: 78 },
    { name: t.topics.comprehension, score: 92 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-white">
      <div className="mb-6 p-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg dark:text-white mx-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">{t.statistics}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">{t.assessmentsByMonth}</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="assessments" fill="#7FE7D9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">{t.progressByTopic}</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="score" fill="#FF7F50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
