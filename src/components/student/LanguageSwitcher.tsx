
import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "he";
  onLanguageChange: (language: "en" | "he") => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <Button
      variant="ghost"
      className="text-xs"
      onClick={() => onLanguageChange(currentLanguage === "en" ? "he" : "en")}
    >
      <Globe className="h-4 w-4 mr-1" />
      <span>{currentLanguage === "en" ? "עברית" : "English"}</span>
    </Button>
  );
};

export default LanguageSwitcher;