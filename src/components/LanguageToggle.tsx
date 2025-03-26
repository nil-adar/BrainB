
import { useEffect } from "react";

interface LanguageToggleProps {
  language: "en" | "he";
  toggleLanguage: () => void;
  className?: string;
}

export const LanguageToggle = ({ language, toggleLanguage, className }: LanguageToggleProps) => {
  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  return (
    <button
      onClick={toggleLanguage}
      className={`text-gray-600 hover:text-gray-900 ${className}`}
    >
      {language === "en" ? "עברית" : "English"}
    </button>
  );
};
