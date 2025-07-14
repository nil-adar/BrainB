export const translateDiagnosisType = (
  type: string,
  lang: "he" | "en"
): string => {
  const map: Record<string, { he: string; en: string }> = {
    Combined: { he: "משולב", en: "Combined" },
    Hyperactivity: { he: "היפראקטיביות", en: "Hyperactivity" },
    Inattentive: { he: "קשב", en: "Inattentive" },
    Impulsivity: { he: "אימפולסיביות", en: "Impulsivity" },
  };

  return map[type]?.[lang] ?? type;
};
