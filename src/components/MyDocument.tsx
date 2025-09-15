/* eslint-disable @typescript-eslint/no-explicit-any */
import { Recommendation } from "@/types/recommendation";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { he, enUS } from "date-fns/locale";
import HeeboRegular from "@/components/ui/fonts/Heebo-Light.ttf";
import HeeboBold from "@/components/ui/fonts/Heebo-Medium.ttf";
import { translateDiagnosisType } from "@/utils/translateDiagnosisType";

interface MyDocumentProps {
  recommendations: Recommendation[];
  lang: "he" | "en";
}

Font.register({
  family: "Heebo",
  fonts: [
    { src: HeeboRegular, fontWeight: "normal" },
    { src: HeeboBold, fontWeight: "bold" },
  ],
});

// תרגומים
const translations = {
  en: {
    title: " Recommendations Guide",
    subTitle: "Evidence-based strategies for ADHD and behavioral support",
    dateLabel: "Generated on",
    diagnosisType: "Diagnosis Type",
    category: "Category",
    difficulty: "Difficulty Description",
    recommendation: "Recommendation",
    example: "Example",
    contribution: "Contribution",
  },
  he: {
    title: "מדריך המלצות ",
    subTitle: "אסטרטגיות מבוססות ראיות להפרעת קשב ותמיכה רגשית",
    dateLabel: "תאריך",
    diagnosisType: "סוג אבחנה",
    category: "קטגוריה",
    difficulty: "תיאור קושי",
    recommendation: "המלצה",
    example: "דוגמה",
    contribution: "תרומה",
  },
};

function cleanText(str: string) {
  return str
    .replace(/[\u200e\u200f\u202f\u2066\u2067\u2068\u2069]/g, "") // סימני RTL/LTR
    .replace(/\u00A0/g, " ") // רווח קשיח לרווח רגיל
    .trim();
}

Font.register({
  family: "Heebo",
  src: "/fonts/Heebo/Heebo-Regular.ttf",
});

const MyDocument: React.FC<MyDocumentProps> = ({ recommendations, lang }) => {
  const firstRecommendation = recommendations[0]?.recommendation;
  const firstDifficulty = recommendations[0]?.difficulty_description;

  if (
    typeof firstRecommendation === "object" &&
    firstRecommendation !== null &&
    "he" in firstRecommendation
  ) {
    //console.log("✅ המלצה בעברית:", firstRecommendation.he);
  } else {
    //console.log("✅ המלצה בעברית (string):", firstRecommendation);
  }

  if (
    typeof firstDifficulty === "object" &&
    firstDifficulty !== null &&
    "he" in firstDifficulty
  ) {
    //console.log("✅ תיאור קושי בעברית:", firstDifficulty.he);
  } else {
    //console.log("✅ תיאור קושי בעברית (string):", firstDifficulty);
  }

  const t = translations[lang];
  const dateStr = format(new Date(), "PPP", {
    locale: lang === "he" ? he : enUS,
  });

  const isRTL = lang === "he";

  // סגנונות
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Heebo",
      padding: 40,
      fontSize: 12,
      direction: isRTL ? "rtl" : "ltr",
    },
    rtlPage: {
      direction: "rtl",
    },
    title: {
      fontSize: 20,
      textAlign: "justify",
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 10,
      textAlign: "center",
      marginBottom: 20,
    },
    date: {
      fontSize: 10,
      textAlign: "center",
      marginBottom: 20,
    },
    card: {
      border: "1 solid #ccc",
      borderRadius: 6,
      padding: 10,
      marginBottom: 12,
      backgroundColor: "#f9f9f9",
      textAlign: isRTL ? "right" : "left",
    },
    label: {
      fontWeight: "bold", // הכותרות בBOLD
      marginTop: 4,
      textAlign: isRTL ? "right" : "left",
    },
    value: {
      fontWeight: "normal",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    rtlText: {
      textAlign: "right",
      direction: "rtl",
    },
    ltrText: {
      textAlign: "left",
      direction: "ltr",
    },
  });

  console.log("📄 recs for PDF:", recommendations);

  const getText = (
    field:
      | string
      | Record<"he" | "en", string | string[]>
      | string[]
      | undefined,
    isdiagnosisType: boolean = false
  ): string => {
    if (!field) return "-";
    let result = "";

    if (typeof field === "string") {
      result = field;
    } else if (Array.isArray(field)) {
      result = field.join(", ");
    } else if (typeof field === "object") {
      const value = field[lang];
      if (Array.isArray(value)) {
        result = value.join(", ");
      } else if (typeof value === "string") {
        result = value;
      }
    }

    // אם זה diagnosis type, תרגם אותו
    if (isdiagnosisType && result && result !== "-") {
      result = translateDiagnosisType(result, lang);
    }

    return result || "-";
  };

const getTranslatedCategory = (category: string): string => {
  if (!category) return lang === "he" ? "לא מסווג" : "Uncategorized";

  const hebrewToEnglish = {
    "תזונה": "nutrition",
    "פעילות גופנית": "physical activity", 
    "סביבה": "environment",
    "שינויים סביבתיים": "environmental changes",
    "תמיכה מקצועית": "professional support"
  };

  const englishToHebrew = {
    "nutrition": "תזונה",
    "physical activity": "פעילות גופנית",
    "environment": "סביבה", 
    "environmental changes": "שינויים סביבתיים",
    "professional support": "תמיכה מקצועית"
  };

  const normalizedCategory = category.trim().toLowerCase();
  
  // אם השפה אנגלית ויש תרגום מעברית
  if (lang === "en" && hebrewToEnglish[category]) {
    return hebrewToEnglish[category];
  }
  
  // אם השפה עברית ויש תרגום מאנגלית
  if (lang === "he" && englishToHebrew[normalizedCategory]) {
    return englishToHebrew[normalizedCategory];
  }

  // אחרת החזר כמות שזה (בלי לתרגם)
  return category;
};

  // מניחים שמעתה category הוא מחרוזת תקינה
  const getCategory = (rec: any): string =>
    (typeof rec?.category === "string" && rec.category.trim()) ||
    "Uncategorized";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Text style={[styles.title, isRTL ? styles.rtlText : styles.ltrText]}>
          {t.title}
        </Text>
        {t.subTitle && (
          <Text
            style={[styles.subTitle, isRTL ? styles.rtlText : styles.ltrText]}
          >
            {t.subTitle}
          </Text>
        )}
        <Text style={[styles.date, isRTL ? styles.rtlText : styles.ltrText]}>
          {t.dateLabel}: {dateStr}
        </Text>

        {recommendations.map((rec, i) => (
          <View key={i} style={styles.card}>
            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.diagnosisType}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getText(rec.diagnosis_type, true))}
            </Text>

            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.category}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getTranslatedCategory(getText(rec.category)))}
            </Text>

            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.difficulty}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getText(rec.difficulty_description))}
            </Text>

            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.recommendation}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getText(rec.recommendation))}
            </Text>

            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.example}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getText(rec.example))}
            </Text>

            <Text
              style={[styles.label, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {t.contribution}:
            </Text>
            <Text
              style={[styles.value, isRTL ? styles.rtlText : styles.ltrText]}
            >
              {cleanText(getText(rec.contribution))}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;
