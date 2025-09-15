export const translateDiagnosisType = (
  type: string,
  lang: "he" | "en"
): string => {
  if (!type) return "";
  if (type.includes(",")) {
    return type
      .split(",")
      .map((part) => translateDiagnosisType(part.trim(), lang))
      .join(", ");
  }

  const norm = (s: string) => s?.trim().toLowerCase();

  const aliases: Record<string, string> = {
    inattention: "Inattention",
    hyperactive: "Hyperactivity",
    hyperactivity: "Hyperactivity",
    impulsivity: "Impulsivity",
    combined: "Combined",
    trauma: "Trauma",
    טראומה: "Trauma",
    "חוסר קשב": "Inattention",
    היפראקטיביות: "Hyperactivity",
    אימפולסיביות: "Impulsivity",
    משולב: "Combined",
  };

  const canonical = aliases[norm(type)] || type;

  const map: Record<string, { he: string; en: string }> = {
    Combined: { he: "משולב", en: "Combined" },
    Hyperactivity: { he: "היפראקטיביות", en: "Hyperactivity" },
    Inattention: { he: "חוסר קשב", en: "Inattention" },
    Impulsivity: { he: "אימפולסיביות", en: "Impulsivity" },
    Trauma: { he: "טראומה", en: "Trauma" },
  };

  return map[canonical]?.[lang] ?? canonical;
};
