import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Recommendation } from "@/types/recommendation";

// RTL סטיילים עם יישור לימין
const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    direction: "rtl",
    textAlign: "right",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  label: { fontSize: 12, fontWeight: "bold" },
  text: { fontSize: 12, marginBottom: 5 },
});

interface Props {
  recommendations: Recommendation[];
  lang: "he" | "en";
}

const MyDocument = ({ recommendations, lang }: Props) => {
  const isHebrew = lang === "he";

  return (
    <Document>
      <Page style={{ padding: 30 }}>
        {recommendations.map((rec, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.title}>{`${i + 1}. ${
              rec.category[lang]
            }`}</Text>

            <Text style={styles.label}>
              {isHebrew ? "סוג אבחון:" : "Diagnosis type:"}
            </Text>
            <Text style={styles.text}>{rec.diagnosis_type[lang]}</Text>

            <Text style={styles.label}>
              {isHebrew ? "תיאור קושי:" : "Difficulty description:"}
            </Text>
            <Text style={styles.text}>{rec.difficulty_description[lang]}</Text>

            <Text style={styles.label}>
              {isHebrew ? "המלצה:" : "Recommendation:"}
            </Text>
            <Text style={styles.text}>{rec.recommendation[lang]}</Text>

            <Text style={styles.label}>
              {isHebrew ? "דוגמה ליישום:" : "Example:"}
            </Text>
            <Text style={styles.text}>{rec.example[lang]}</Text>

            <Text style={styles.label}>
              {isHebrew ? "תרומה אפשרית:" : "Contribution:"}
            </Text>
            <Text style={styles.text}>{rec.contribution[lang]}</Text>

            <Text style={styles.label}>
              {isHebrew ? "תגיות קושי:" : "Difficulty tags:"}
            </Text>
            <Text style={styles.text}>{rec.difficulty_tags.join(", ")}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default MyDocument;
