/**
 * SettingsContext.tsx
 *
 * מספק הקשר גלובלי לניהול הגדרות שפה (עברית/אנגלית) ותמה (בהירה/כהה) בכל האפליקציה.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// סוגי השפה האפשריים / Available language types
type Language = 'he' | 'en';
// סוגי התמה האפשריים / Available theme types
type Theme = 'light' | 'dark';

/**
 * ממשק המציג את התוכן שנשמר ב-Context
 * Interface for the context value
 */
interface SettingsContextType {
  /**
   * השפה הנוכחית ('he' | 'en')
   * Current language ('he' | 'en')
   */
  language: Language;
  /**
   * התמה הנוכחית ('light' | 'dark')
   * Current theme ('light' | 'dark')
   */
  theme: Theme;
  /**
   * פונקציה לשינוי השפה
   * Function to change the language
   */
  setLanguage: (lang: Language) => void;
  /**
   * פונקציה לשינוי התמה
   * Function to change the theme
   */
  setTheme: (theme: Theme) => void;
}

// יצירת ה-Context עם ערך התחלתי undefined
// Create Context with initial undefined
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Hook לשימוש בהגדרות מתוך כל קומפוננטה
 * Custom hook to consume settings context
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

/**
 * פרופס ל-SettingsProvider
 * Props for SettingsProvider
 */
interface SettingsProviderProps {
  children: ReactNode;
}

/**
 * SettingsProvider - ספק הגדרות גלובלי
 * Provides language and theme settings to the app
 */
export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // מצב לשפה, ברירת מחדל 'he'
  // Language state, default 'he'
  const [language, setLanguage] = useState<Language>('he');
  // מצב לתמה, ברירת מחדל 'light'
  // Theme state, default 'light'
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // טוען שפה ותמה שנשמרו ב-localStorage
    // Load saved settings from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // מיישם את התמה על אלמנט ה-root ושומר ב-localStorage
    // Apply theme class to document and save
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // שומר את השפה ב-localStorage
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  // ערך הקשר שיישלח לצרכנים
  // Context value to provide
  const value = {
    language,
    theme,
    setLanguage,
    setTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
