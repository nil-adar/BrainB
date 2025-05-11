
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const translations = {
  en: {
    back: "Back",
    settings: "Settings",
    profileSettings: "Profile Settings",
    fullName: "Full Name",
    email: "Email",
    systemPreferences: "System Preferences",
    notifications: "Notifications",
    language: "Language",
    home: "Home"
  },
  he: {
    back: "חזור",
    settings: "הגדרות",
    profileSettings: "הגדרות פרופיל",
    fullName: "שם מלא",
    email: "אימייל",
    systemPreferences: "העדפות מערכת",
    notifications: "התראות",
    language: "שפה",
    home: "דף הבית"
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: t.settings },
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">הגדרות</h1>
        
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">הגדרות פרופיל</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">שם מלא</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue="שרה לוי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">אימייל</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded-lg"
                  defaultValue="sara@example.com"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">העדפות מערכת</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>התראות</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>שפה</span>
                <select className="p-2 border rounded-lg">
                  <option value="he">עברית</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
