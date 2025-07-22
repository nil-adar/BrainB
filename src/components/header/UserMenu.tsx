
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";

interface UserMenuProps {
  translations: {
    profile?: string;
    settings: string;
    logout: string;
    userAccount?: string;
  };
}

export const UserMenu = ({ translations }: UserMenuProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <UserAvatar className="h-9 w-9" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white w-56">
        <DropdownMenuLabel>{translations.userAccount || "חשבון משתמש"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {translations.profile && (
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{translations.profile}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>{translations.settings}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{translations.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

