import { useState } from "react";
import { Bell, Globe, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/header/UserMenu";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getLocalizedDate } from "@/utils/dateTranslations";
import { format } from "date-fns";

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

export const StudentHeader = ({
  language,
  translations,
}: StudentHeaderProps) => {
  const navigate = useNavigate();
  const currentDate = getLocalizedDate(
    format(new Date(), "EEEE, MMM do, yyyy"),
    language
  );

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* צד שמאל - תאריך */}
          <div className="flex items-center">
            <span className="text-gray-600">{currentDate}</span>
          </div>

          {/* מרכז - לוגו */}
          <div className="flex justify-center">
            <Logo size="md" />
          </div>

          {/* צד ימין - כלים */}
          <div className="flex items-center gap-4">
            <LanguageToggle variant="button" />

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
