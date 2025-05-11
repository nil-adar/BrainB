
import { useEffect } from "react";
import { Globe } from "lucide-react";//יבוא האייקון גלובוס 

interface LanguageToggleProps {
  language: "en" | "he";
  toggleLanguage: () => void;
  className?: string;
}

export const LanguageToggle = ({ language, toggleLanguage, className }: LanguageToggleProps) => {
  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <button
      onClick={toggleLanguage}
      className={`text-gray-600 hover:text-gray-900 ${className}`}
    >
    <Globe size={20} />
      {language === "en" ? "עברית" : "English"}
    </button>
  );
};