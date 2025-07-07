export function translateDiagnosisType(type: string, lang: "he" | "en") {
  const map = {
    Combined: { he: "משולב", en: "Combined" },
    Inattentive: { he: "חוסר קשב", en: "Inattentive" },
    Hyperactivity: { he: "היפראקטיבי", en: "Hyperactivity" },
    Impulsivity: { he: "אימפולסיבי", en: "Impulsivity" },
    NoADHD: { he: "ללא ADHD", en: "No ADHD" },
  };
  return map[type]?.[lang] || type;
}
