
import { Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/components/SettingsContext';

const SettingsToggle = () => {
  const { language, theme, setLanguage, setTheme } = useSettings();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
        {language === 'he' ? 'עברית' : 'English'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="flex items-center gap-2"
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </Button>
    </div>
  );
};

export default SettingsToggle;
