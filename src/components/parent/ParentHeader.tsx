import { useState } from "react";
import { Bell, Globe, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/header/UserMenu";
import { useNavigate } from "react-router-dom";
import { NotificationsDropdown } from "@/components/parent/NotificationsDropdown";
import type { ParentNotification } from "@/hooks/useParentNotifications";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getLocalizedDate } from "@/utils/dateTranslations";

interface ParentHeaderProps {
  language: "en" | "he";
  notifications: ParentNotification[];
  onNotificationClick: (
    teacherId: string,
    studentId: string,
    studentName: string
  ) => void;
  onNotificationCheckboxChange: (notificationId: string) => void;
  onColorSelection: (notificationId: string, color: string) => void;
  translations: {
    //search: string;
    settings?: string;
    logout?: string;
    profile?: string;
    notifications?: string;
    noNotifications?: string;
    viewConversation?: string;
    viewAssessment?: string;
  };
}

export const ParentHeader = ({
  language,
  notifications,
  onNotificationClick,
  onNotificationCheckboxChange,
  onColorSelection,
  translations,
}: ParentHeaderProps) => {
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
          {/* מרכז - ריק לפיזור */}
          <div className="flex-1"></div>
          {/*
          //LOGO + SEARCH
          <div className="flex items-center gap-8">
            <Logo size="md" />
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={language === "en" ? "Search" : "חיפוש"}
                className="pl-10 w-[300px]"
              />
            </div>
          </div>
          */}

          {/* צד ימין - כלים */}
          <div className="flex items-center gap-4">
            <LanguageToggle variant="button" />
            {/* תפריט התראות */}
            <NotificationsDropdown
              notifications={notifications}
              onNotificationClick={onNotificationClick}
              onNotificationCheckboxChange={onNotificationCheckboxChange}
              onColorSelection={onColorSelection}
              translations={{
                notifications: translations.notifications || "התראות",
                noNotifications: translations.noNotifications || "אין התראות",
                viewConversation: translations.viewConversation || "פתח שיחה",
                viewAssessment: translations.viewAssessment || "צפה בהערכה",
              }}
            />
            <div className="rounded-md hover:bg-emerald-100 transition-colors">
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
      </div>
    </header>
  );
};
