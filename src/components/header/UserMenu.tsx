import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useSettings } from "@/components/SettingsContext";

interface UserMenuProps {
  translations?: {
    settings?: string;
    logout?: string;
    user?: string;
  };
}

export const UserMenu: React.FC<UserMenuProps> = ({ translations }) => {
  const navigate = useNavigate();
  const { language } = useSettings();

  // תרגומים בהתאם לשפה הנוכחית
  const defaultTranslations = {
    he: {
      settings: "הגדרות",
      logout: "התנתק",
      user: "משתמש",
    },
    en: {
      settings: "Settings",
      logout: "Logout",
      user: "User",
    },
  };

  const t = {
    settings:
      translations?.settings ||
      defaultTranslations[language]?.settings ||
      defaultTranslations.he.settings,
    logout:
      translations?.logout ||
      defaultTranslations[language]?.logout ||
      defaultTranslations.he.logout,
    user:
      translations?.user ||
      defaultTranslations[language]?.user ||
      defaultTranslations.he.user,
  };

  const user = {
    name:
      localStorage.getItem("userName") ||
      JSON.parse(localStorage.getItem("user") || "{}")?.name ||
      t.user,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <UserAvatar className="w-8 h-8" />
          <span className="hidden md:inline">{user.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel className="text-right">
          {user.name}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="flex items-center gap-3 text-right cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          {t.settings}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 text-right cursor-pointer text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
