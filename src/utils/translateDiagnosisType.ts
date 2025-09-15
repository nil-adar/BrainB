export const translateDiagnosisType = (
  type: string,
  lang: "he" | "en"
): string => {
  const norm = (s: string) => s?.trim().toLowerCase();

  const aliases: Record<string, string> = {
    Inattention: "Inattention",
    hyperactive: "Hyperactivity",
    hyperactivity: "Hyperactivity",
    impulsivity: "Impulsivity",
    combined: "Combined",
  };

  const canonical = aliases[norm(type)] || type;

  const map: Record<string, { he: string; en: string }> = {
    Combined: { he: "משולב", en: "Combined" },
    Hyperactivity: { he: "היפראקטיביות", en: "Hyperactivity" },
    Inattention: { he: "חוסר קשב", en: "Inattention" },
    Impulsivity: { he: "אימפולסיביות", en: "Impulsivity" },
  };

  return map[canonical]?.[lang] ?? canonical;
};
