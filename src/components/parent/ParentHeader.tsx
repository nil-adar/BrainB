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


interface ParentHeaderProps {
  language: "en" | "he";
  toggleLanguage: () => void;
  notifications: ParentNotification[];
  onNotificationClick: (teacherId: string, studentId: string, studentName: string) => void;
  onNotificationCheckboxChange: (notificationId: string) => void;
  onColorSelection: (notificationId: string, color: string) => void;
  translations: {
    search: string;
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
  toggleLanguage,
  notifications,
  onNotificationClick,
  onNotificationCheckboxChange,
  onColorSelection,
  translations,
}: ParentHeaderProps) => {
  const navigate = useNavigate();
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* לוגו + חיפוש */}
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

          {/* כלים נוספים כולל התראות */}
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

            {/* תפריט התראות כמו אצל המורה */}
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
