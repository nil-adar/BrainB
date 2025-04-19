
import { Search, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "Recommendations",
    nutritionalAdvice: "Nutritional Advice",
    physicalActivity: "Physical Activity Suggestions",
    environmentalModifications: "Environmental Modifications",
    formalRecommendations: "Formal recommendations file:",
    search: "Search",
    greeting: "Good morning",
    viewRecommendations: "View recommendations",
    home: "Home",
  },
  he: {
    title: "המלצות",
    nutritionalAdvice: "המלצות תזונה",
    physicalActivity: "המלצות פעילות גופנית",
    environmentalModifications: "התאמות סביבתיות",
    formalRecommendations: "קובץ המלצות פורמלי:",
    search: "חיפוש",
    greeting: "בוקר טוב",
    viewRecommendations: "צפייה בהמלצות",
    home: "דף הבית",
  }
};

export default function Recommendations() {
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: "מיה פרץ", href: "/student/123" },
    { label: t.title },
  ];

  const handleNutritionClick = () => {
    document.documentElement.dir = "rtl";
    navigate('/nutritional-recommendations');
  };

  const handlePhysicalClick = () => {
    document.documentElement.dir = "rtl";
    navigate('/physical-recommendations');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{`${t.greeting}, שרה`}</h1>
          <h2 className="text-2xl font-semibold text-gray-700">{t.title}</h2>
        </div>

        {/* Recommendation Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            variant="secondary"
            className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/20"
            onClick={handleNutritionClick}
          >
            <img 
              src="/lovable-uploads/37956930-4a12-43ab-8954-771975d7735f.png" 
              alt="Nutritional Advice Icon" 
              className="w-32 h-32 object-cover rounded-lg"
            />
            <span className="text-xl font-semibold">{t.nutritionalAdvice}</span>
          </Button>

          <Button
            variant="secondary"
            className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/20"
            onClick={handlePhysicalClick}
          >
            <img 
              src="/lovable-uploads/9763419c-0e06-40b4-90a1-f6969514f16e.png" 
              alt="Physical Activity Icon" 
              className="w-32 h-32 object-cover rounded-lg"
            />
            <span className="text-xl font-semibold">{t.physicalActivity}</span>
          </Button>

          <Button
            variant="secondary"
            className="h-auto p-8 flex flex-col items-center gap-4 hover:bg-primary/20"
            onClick={() => navigate('/recommendations/environmental')}
          >
            <img 
              src="/lovable-uploads/47ed425a-be3a-46dc-9573-8c0d92d0150f.png" 
              alt="Environmental Modifications Icon" 
              className="w-16 h-16"
            />
            <span className="text-xl font-semibold">{t.environmentalModifications}</span>
          </Button>
        </div>

        {/* Formal Recommendations Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t.formalRecommendations}</h3>
          <Card className="p-6">
            <div className="relative flex-1 max-w-md mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t.search}
                className="pl-10"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h4 className="text-xl font-bold mb-2">CHAPTER 1</h4>
              <p className="text-lg">SUMMARY OF FINDINGS, CONCLUSION, AND</p>
              <p className="text-lg">RECOMMENDATIONS</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
