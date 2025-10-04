import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsDropdown } from "@/components/teacher/NotificationsDropdown";
import { Notification } from "@/types/school";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/header/UserMenu";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import HelpButton from "@/components/HelpButton";

interface TeacherHeaderProps {
  currentDate?: string;
  language: "en" | "he";
  notifications: Notification[];
  onNotificationClick: (
    parentId: string,
    studentId: string,
    studentName: string
  ) => void;

  onNotificationCheckboxChange: (notificationId: string) => void;
  onNotificationColorSelection: (notificationId: string, color: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  translations: {
    search: string;
    notifications: string;
    noNotifications: string;
    viewConversation: string;
    viewAssessment: string;
    settings?: string;
    logout?: string;
  };
}

export const TeacherHeader = ({
  currentDate,
  language,
  notifications,
  onNotificationClick,
  onNotificationCheckboxChange,
  onNotificationColorSelection,
  searchTerm,
  onSearchChange,
  translations: t,
}: TeacherHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo
              size="sm"
              onClick={() => navigate("/teacher-dashboard")}
              className="cursor-pointer"
            />
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={language === "he" ? "חפש תלמיד" : "Search student"}
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{currentDate}</span>
            <HelpButton
              page="teacherDashboard"
              language={language}
              variant="icon"
            />
            <LanguageToggle variant="button" />
            <NotificationsDropdown
              notifications={notifications as any}
              translations={{
                notifications: t.notifications,
                noNotifications: t.noNotifications,
                viewConversation: t.viewConversation,
                viewAssessment: t.viewAssessment,
              }}
              onNotificationClick={onNotificationClick}
              onNotificationCheckboxChange={onNotificationCheckboxChange}
              onColorSelection={onNotificationColorSelection}
            />

            <UserMenu
              translations={{
                settings: t.settings,
                logout: t.logout,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
