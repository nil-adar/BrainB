
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const isStatisticsPage = location.pathname === "/statistics";

  useEffect(() => {
    // Check initial theme only on statistics page
    if (isStatisticsPage) {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    } else {
      // Remove dark mode on other pages
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, [location.pathname, isStatisticsPage]);

  const toggleTheme = () => {
    if (!isStatisticsPage) return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Only show the toggle button on statistics page
  if (!isStatisticsPage) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 rounded-full bg-primary/10 hover:bg-primary/20"
      title={isDark ? "מצב יום" : "מצב לילה"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
    </Button>
  );
};
