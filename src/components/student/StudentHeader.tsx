
import { useState } from "react";
import { Bell, Globe, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/header/UserMenu";
import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  language: "en" | "he";
  toggleLanguage: () => void;
  translations: {
    search: string;
    settings?: string;
    logout?: string;
    profile?: string;
  };
}

export const StudentHeader = ({ language, toggleLanguage, translations }: StudentHeaderProps) => {
  const navigate = useNavigate();
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder={language === "en" ? "Search" : "חיפוש"}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{currentDate}</span>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              <Globe className="w-5 h-5" />
              <span>{language === "en" ? "עברית" : "English"}</span>
            </button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserMenu 
              translations={{
                profile: translations.profile || "פרופיל",
                settings: translations.settings || "הגדרות",
                logout: translations.logout || "התנתק",
              }} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};
