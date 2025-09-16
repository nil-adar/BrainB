//utils/filterRecommendationsByType.ts

export const filterRecommendationsByType = (
  recommendations: any[],
  targetType: string
) => {
  return recommendations.filter((rec: any) => {
    const hasSpecialTag = (rec.tags || []).some((tag: string) =>
      ["trauma_suspected", "professional_assessment"].includes(tag)
    );

    if (hasSpecialTag) return true;

    const diagnosisType = rec.diagnosis_type;
    let diagnosisArray: string[] = [];

    if (typeof diagnosisType === "string") {
      diagnosisArray = [diagnosisType];
    } else if (Array.isArray(diagnosisType)) {
      diagnosisArray = diagnosisType;
    } else if (diagnosisType?.en) {
      diagnosisArray = Array.isArray(diagnosisType.en)
        ? diagnosisType.en
        : [diagnosisType.en];
    }

    return diagnosisArray.some((type: string) =>
      type.toLowerCase().includes(targetType.toLowerCase())
    );
  });
};
