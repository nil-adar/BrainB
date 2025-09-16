// utils/dateTranslations.ts - קובץ חדש לתרגום תאריכים

export const hebrewDays = [
  "יום ראשון",
  "יום שני",
  "יום שלישי",
  "יום רביעי",
  "יום חמישי",
  "יום שישי",
  "יום שבת",
];

export const hebrewMonths = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

export const hebrewMonthsShort = [
  "ינו",
  "פבר",
  "מרץ",
  "אפר",
  "מאי",
  "יונ",
  "יול",
  "אוג",
  "ספט",
  "אוק",
  "נוב",
  "דצמ",
];

// פונקציה שמתרגמת תאריך באנגלית לעברית - שומרת על הפורמט המקורי
export const translateDateToHebrew = (englishDateString: string): string => {
  // תרגום ימים באנגלית לעברית
  const dayTranslations: Record<string, string> = {
    Sunday: "יום ראשון",
    Monday: "יום שני",
    Tuesday: "יום שלישי",
    Wednesday: "יום רביעי",
    Thursday: "יום חמישי",
    Friday: "יום שישי",
    Saturday: "יום שבת",
    Sun: "א׳",
    Mon: "ב׳",
    Tue: "ג׳",
    Wed: "ד׳",
    Thu: "ה׳",
    Fri: "ו׳",
    Sat: "ש׳",
  };

  // תרגום חודשים באנגלית לעברית
  const monthTranslations: Record<string, string> = {
    January: "ינואר",
    February: "פברואר",
    March: "מרץ",
    April: "אפריל",
    May: "מאי",
    June: "יוני",
    July: "יולי",
    August: "אוגוסט",
    September: "ספטמבר",
    October: "אוקטובר",
    November: "נובמבר",
    December: "דצמבר",
    Jan: "ינו",
    Feb: "פבר",
    Mar: "מרץ",
    Apr: "אפר",
    Jun: "יונ",
    Jul: "יול",
    Aug: "אוג",
    Sep: "ספט",
    Oct: "אוק",
    Nov: "נוב",
    Dec: "דצמ",
  };

  let translatedDate = englishDateString;
  translatedDate = translatedDate.replace(/(\d+)(st|nd|rd|th)/g, "$1");

  // תרגום ימים
  Object.entries(dayTranslations).forEach(([english, hebrew]) => {
    translatedDate = translatedDate.replace(
      new RegExp(`\\b${english}\\b`, "g"),
      hebrew
    );
  });

  // תרגום חודשים
  Object.entries(monthTranslations).forEach(([english, hebrew]) => {
    translatedDate = translatedDate.replace(
      new RegExp(`\\b${english}\\b`, "g"),
      hebrew
    );
  });

  return translatedDate;
};

// פונקציה ליצירת תאריך בפורמט מותאם לשפה
export const formatDateByLanguage = (
  date: Date,
  language: "he" | "en",
  format: "full" | "short" | "custom" = "full",
  customFormat?: string
): string => {
  if (language === "he") {
    const dayName = hebrewDays[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = hebrewMonths[date.getMonth()];
    const year = date.getFullYear();

    switch (format) {
      case "full":
        return `${dayName}, ${dayNumber} ${monthName} ${year}`;
      case "short":
        return `${dayNumber} ${hebrewMonthsShort[date.getMonth()]} ${year}`;
      case "custom":
        if (customFormat) {
          // אפשרות ליצור פורמט מותאם בעתיד
          return `${dayName}, ${dayNumber} ${monthName} ${year}`;
        }
        return `${dayName}, ${dayNumber} ${monthName} ${year}`;
      default:
        return `${dayName}, ${dayNumber} ${monthName} ${year}`;
    }
  } else {
    // תאריך באנגלית - משתמש ב-format רגיל
    switch (format) {
      case "full":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "short":
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      default:
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
    }
  }
};

// פונקציה שמחזירה תאריך מתורגם אם השפה עברית, או את המקורי אם אנגלית
export const getLocalizedDate = (
  englishDateString: string,
  language: "he" | "en"
): string => {
  return language === "he"
    ? translateDateToHebrew(englishDateString)
    : englishDateString;
};
