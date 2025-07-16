/**
 * SettingsContext.tsx
 *
 * מספק הקשר גלובלי לניהול הגדרות שפה (עברית/אנגלית) ותמה (בהירה/כהה) בכל האפליקציה.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// סוגי השפה האפשריים / Available language types
type Language = "he" | "en";

/**
 * Interface for the context value
 */
interface SettingsContextType {
  /**
   * Current language ('he' | 'en')
   */
  language: Language;
  /**
   * Function to change the language
   */
  setLanguage: (lang: Language) => void;
  /**
   * Function to update document direction
   */
  updateDocumentDirection: () => void;
}

// Create Context with initial undefined
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

/**
 * Custom hook to consume settings context
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

/**
 * Props for SettingsProvider
 */
interface SettingsProviderProps {
  children: ReactNode;
}

/**
 * Provides language settings to the app
 */
export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // Language state, default 'he'
  const [language, setLanguage] = useState<Language>("he");

  // פונקציה לעדכון כיוון המסמך
  const updateDocumentDirection = () => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  };

  // טען הגדרות מ-localStorage בטעינה הראשונה
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "he" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // עדכן localStorage וכיוון המסמך כאשר השפה משתנה
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // ערך הקשר שיישלח לצרכנים
  const value = {
    language,
    setLanguage,
    updateDocumentDirection,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
