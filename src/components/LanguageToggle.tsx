import { useEffect } from "react";
import { Globe } from "lucide-react";
import { useSettings } from "../components/SettingsContext";

interface LanguageToggleProps {
  className?: string;
  variant?: "toolbar" | "button" | "minimal";
  showIcon?: boolean;
  showText?: boolean;
}

export const LanguageToggle = ({
  className = "",
  variant = "toolbar",
  showIcon = true,
  showText = true,
}: LanguageToggleProps) => {
  const { language, setLanguage } = useSettings();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const baseStyles = "flex items-center gap-2 transition-colors";

  const variants = {
    toolbar:
      "text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100",
    button:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md shadow-sm",
    minimal: "text-gray-500 hover:text-gray-700 p-1",
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      title={language === "he" ? "Switch to English" : "החלף לעברית"}
    >
      {showIcon && <Globe size={20} />}
      {showText && (
        <span className="text-sm">
          {language === "en" ? "עברית" : "English"}
        </span>
      )}
    </button>
  );
};
