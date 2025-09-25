// utils/timeGreetings.ts
export const getTimeBasedGreeting = (language: "en" | "he") => {
  const hour = new Date().getHours();

  if (language === "he") {
    if (hour >= 5 && hour < 12) return "בוקר טוב";
    if (hour >= 12 && hour < 17) return "צהריים טובים";
    if (hour >= 17 && hour < 21) return "ערב טוב";
    return "לילה טוב";
  } else {
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }
};
