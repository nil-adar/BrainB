
import { Search, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "Nutritional Recommendations",
    search: "Search",
    greeting: "Good morning",
    home: "Home",
    recommendations: "Recommendations",
    sheetPanTitle: "Sheet pan sausage and potatoes",
    sheetPanDesc: "Once you've chosen your ingredients, get chopping! For your protein, it depends on the choice and cut on how you should prep them.",
    pestoTitle: "Pesto pasta salad",
    pestoDesc: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    thirdTitle: "Title",
    thirdDesc: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
  },
  he: {
    title: "המלצות תזונה",
    search: "חיפוש",
    greeting: "בוקר טוב",
    home: "דף הבית",
    recommendations: "המלצות",
    sheetPanTitle: "נקניקיות ותפוחי אדמה בתנור",
    sheetPanDesc: "לאחר שבחרת את המרכיבים שלך, התחל לחתוך! עבור החלבון שלך, זה תלוי בבחירה ובחיתוך כיצד עליך להכין אותם.",
    pestoTitle: "סלט פסטה פסטו",
    pestoDesc: "טקסט גוף לכל מה שתרצה לומר. הוסף נקודות עיקריות, ציטוטים, אנקדוטות, או אפילו סיפור קצר מאוד.",
    thirdTitle: "כותרת",
    thirdDesc: "טקסט גוף לכל מה שתרצה לומר. הוסף נקודות עיקריות, ציטוטים, אנקדוטות, או אפילו סיפור קצר מאוד.",
  }
};

export default function NutritionalRecommendations() {
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = translations[language];
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: "מיה פרץ", href: "/student/123" },
    { label: t.recommendations, href: "/recommendations" },
    { label: t.title },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/e2435809-11d5-47e0-b442-17de9cd7e10e.png" 
              alt="Grilled chicken" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <CardTitle className="text-xl font-semibold mb-2">
                {t.sheetPanTitle}
              </CardTitle>
              <CardDescription>
                {t.sheetPanDesc}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/e2435809-11d5-47e0-b442-17de9cd7e10e.png" 
              alt="Grilled chicken" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <CardTitle className="text-xl font-semibold mb-2">
                {t.pestoTitle}
              </CardTitle>
              <CardDescription>
                {t.pestoDesc}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img 
              src="/lovable-uploads/e2435809-11d5-47e0-b442-17de9cd7e10e.png" 
              alt="Grilled chicken" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <CardTitle className="text-xl font-semibold mb-2">
                {t.thirdTitle}
              </CardTitle>
              <CardDescription>
                {t.thirdDesc}
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
