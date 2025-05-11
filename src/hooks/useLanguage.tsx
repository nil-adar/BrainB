
import { useState, useEffect } from "react";

export const useLanguage = () => {
  // Get stored language preference or default to Hebrew
  const [language, setLanguage] = useState<"en" | "he">(() => {
    const storedLanguage = localStorage.getItem("language");
    return (storedLanguage as "en" | "he") || "he";
  });
  
  useEffect(() => {
    // Update document direction when language changes
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    // Store language preference in localStorage
    localStorage.setItem("language", language);
  }, [language]);
  
  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === "en" ? "he" : "en");
  };

  return { language, toggleLanguage };
};