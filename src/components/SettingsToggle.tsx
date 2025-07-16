import { Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/components/SettingsContext";

const SettingsToggle = () => {
  const { language, setLanguage } = useSettings();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2"
      >
        <Globe size={16} />
        {language === "he" ? "עברית" : "English"}
      </Button>
    </div>
  );
};

export default SettingsToggle;
