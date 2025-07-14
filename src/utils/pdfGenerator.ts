// 📄 generatePDF.ts (משודרג עם כל התוספות)
import jsPDF from "jspdf";

interface Recommendation {
  diagnosis_type: { he: string; en: string };
  category: string;
  difficulty_description: string;
  recommendation: string;
  example: { he: string; en: string };
  contribution: string;
  difficulty_tags: string[];
}

export const generatePDF = (
  recommendations: Recommendation[],
  lang: "he" | "en" = "en"
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // כותרת ראשית
  doc.setFontSize(18).setFont("helvetica", "bold");
  doc.text(
    lang === "he" ? "המלצות מותאמות אישית" : "Personalized Recommendations",
    margin,
    y
  );
  y += 10;

  recommendations.forEach((rec, i) => {
    if (y > pageHeight - 50) {
      doc.addPage();
      y = margin;
    }

    // כותרת קטגוריה
    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${rec.category}`, margin, y);
    y += 6;

    // סוג אבחנה
    doc.setFontSize(10).setFont("helvetica", "normal");
    doc.text(
      `${lang === "he" ? "סוג אבחנה" : "Diagnosis Type"}: ${
        rec.diagnosis_type[lang]
      }`,
      margin,
      y
    );
    y += 5;

    // קושי
    doc.setFont("helvetica", "bold");
    doc.text(`${lang === "he" ? "קושי" : "Difficulty"}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(
      doc.splitTextToSize(rec.difficulty_description, contentWidth),
      margin,
      y
    );
    y += 12;

    // המלצה
    doc.setFont("helvetica", "bold");
    doc.text(`${lang === "he" ? "המלצה" : "Recommendation"}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(rec.recommendation, contentWidth), margin, y);
    y += 12;

    // דוגמה
    doc.setFont("helvetica", "bold");
    doc.text(`${lang === "he" ? "דוגמה" : "Example"}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(
      doc.splitTextToSize(rec.example[lang] ?? rec.example.en, contentWidth),
      margin,
      y
    );
    y += 12;

    // תרומה
    doc.setFont("helvetica", "bold");
    doc.text(`${lang === "he" ? "תרומה" : "Contribution"}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(rec.contribution, contentWidth), margin, y);
    y += 12;
  });

  // Footer בכל עמוד
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `${
        lang === "he" ? "נוצר בתאריך" : "Generated on"
      } ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 10
    );
  }

  // שמירה מיידית
  doc.save(lang === "he" ? "המלצות.pdf" : "recommendations.pdf");

  return doc;
};
