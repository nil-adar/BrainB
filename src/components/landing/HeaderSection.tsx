
import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderSectionProps {
  loginText: string;
  language: "en" | "he";
  toggleLanguage: () => void;
}

export function HeaderSection({ loginText, language, toggleLanguage }: HeaderSectionProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <header className="flex justify-between items-center p-6 md:p-8">
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <Logo size={isMobile ? "xs" : "sm"} showText={true} className="hover:opacity-80 transition-opacity" />
      </div>
      <div className="flex items-center gap-4">
        <LanguageToggle language={language} toggleLanguage={toggleLanguage} className="px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors" />
        <Button 
          variant="outline" 
          onClick={() => navigate("/login")}
        >
          {loginText}
        </Button>
      </div>
    </header>
  );
}
