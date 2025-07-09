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

interface MyDocumentProps {
  recommendations: Recommendation[];
  lang: "he" | "en";
}

// תרגומים
const translations = {
  en: {
    title: "Nutritional Recommendations Guide",
    subTitle:
      "Evidence-based nutrition strategies for ADHD and behavioral support",
    dateLabel: "Generated on",
    diagnosisType: "Diagnosis Type",
    category: "Category",
    difficulty: "Difficulty Description",
    recommendation: "Recommendation",
    example: "Example",
    contribution: "Contribution",
  },
  he: {
    title: "מדריך המלצות תזונתיות",
    subTitle: "אסטרטגיות תזונה מבוססות ראיות להפרעת קשב ותמיכה רגשית",
    dateLabel: "תאריך",
    diagnosisType: "סוג אבחנה",
    category: "קטגוריה",
    difficulty: "תיאור קושי",
    recommendation: "המלצה",
    example: "דוגמה",
    contribution: "תרומה",
  },
};

// סגנונות
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    direction: "ltr",
  },
  rtlPage: {
    direction: "rtl",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
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
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
  },
  value: {
    marginBottom: 4,
  },
});

// הקומפוננטה
const MyDocument: React.FC<MyDocumentProps> = ({ recommendations, lang }) => {
  const t = translations[lang];
  const dateStr = format(new Date(), "PPP", {
    locale: lang === "he" ? he : enUS,
  });

  const isRTL = lang === "he";

  console.log("📄 recs for PDF:", recommendations);
  console.log("🔤 sample text fields:", {
    firstDiff: recommendations[0]?.difficulty_description,
    textRead: recommendations[0]?.difficulty_description?.[lang],
  });

  // עזר קטן לשליפת שדות לפי שפה - עם טיפוס נכון
  const getText = (
    field:
      | string
      | Record<"he" | "en", string | string[]>
      | string[]
      | undefined
  ): string => {
    if (!field) return "-";
    if (typeof field === "string") return field;
    if (Array.isArray(field)) return field.join(", ");
    if (typeof field === "object") {
      const value = field[lang];
      if (Array.isArray(value)) return value.join(", ");
      if (typeof value === "string") return value;
    }
    return "-";
  };

  // עזר נוסף לקבלת קטגוריה
  const getCategory = (rec: any): string => {
    if (rec.category) return rec.category;
    if (rec.catagory) return getText(rec.catagory);
    return "-";
  };

  return (
    <Document>
      <Page size="A4" style={[styles.page, isRTL && styles.rtlPage]} wrap>
        <Text style={[styles.title, isRTL && { textAlign: "right" }]}>
          {t.title}
        </Text>
        {t.subTitle && <Text style={styles.subTitle}>{t.subTitle}</Text>}
        <Text style={styles.date}>
          {t.dateLabel}: {dateStr}
        </Text>

        {recommendations.map((rec, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.label}>{t.diagnosisType}:</Text>
            <Text style={styles.value}>{getText(rec.diagnosis_type)}</Text>

            <Text style={styles.label}>{t.category}:</Text>
            <Text style={styles.value}>{getCategory(rec)}</Text>

            <Text style={styles.label}>{t.difficulty}:</Text>
            <Text style={styles.value}>
              {getText(rec.difficulty_description)}
            </Text>

            <Text style={styles.label}>{t.recommendation}:</Text>
            <Text style={styles.value}>{getText(rec.recommendation)}</Text>

            <Text style={styles.label}>{t.example}:</Text>
            <Text style={styles.value}>{getText(rec.example)}</Text>

            <Text style={styles.label}>{t.contribution}:</Text>
            <Text style={styles.value}>{getText(rec.contribution)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;
