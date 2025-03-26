
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Settings, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { NotificationsDropdown } from "@/components/teacher/NotificationsDropdown";
import { Notification } from "@/types/school";
import { Logo } from "@/components/ui/logo";

interface TeacherHeaderProps {
  language: "en" | "he";
  toggleLanguage: () => void;
  notifications: Notification[];
  onNotificationClick: (parentId: string) => void;
  onNotificationCheckboxChange: (notificationId: number) => void;
  onNotificationColorSelection: (notificationId: number, color: string) => void;
  translations: {
    search: string;
    notifications: string;
    noNotifications: string;
    viewConversation: string;
    viewAssessment: string;
  };
}

export const TeacherHeader = ({
  language,
  toggleLanguage,
  notifications,
  onNotificationClick,
  onNotificationCheckboxChange,
  onNotificationColorSelection,
  translations: t,
}: TeacherHeaderProps) => {
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
                placeholder={t.search}
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
            <NotificationsDropdown
              notifications={notifications}
              translations={{
                notifications: t.notifications,
                noNotifications: t.noNotifications,
                viewConversation: t.viewConversation,
                viewAssessment: t.viewAssessment
              }}
              onNotificationClick={onNotificationClick}
              onNotificationCheckboxChange={onNotificationCheckboxChange}
              onColorSelection={onNotificationColorSelection}
            />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
