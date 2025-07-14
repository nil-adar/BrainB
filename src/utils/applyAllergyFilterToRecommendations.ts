import { filterExamplesByAllergy } from "./filterExamplesByAllergy";
import { IRecommendation } from "../server/models/RecommendationModel";

export function applyAllergyFilterToRecommendations(
  recommendations: IRecommendation[],
  allergyList: string[],
  language: "he" | "en"
): Partial<IRecommendation>[] {
  const allergyTerms = allergyList.map((a) => a.toLowerCase());

  return recommendations.map((rec) => {
    const newRec = { ...rec };

    if (Array.isArray(rec.example?.en)) {
      const { filtered, matches } = filterExamplesByAllergy(
        rec.example.en,
        allergyTerms
      );
      newRec.example.en = filtered;
      if (matches.length)
        console.log(`⚠️ Allergy match in ${rec._id} (EN):`, matches);
    }

    if (Array.isArray(rec.example?.he)) {
      const { filtered, matches } = filterExamplesByAllergy(
        rec.example.he,
        allergyTerms
      );
      newRec.example.he = filtered;
      if (matches.length)
        console.log(`⚠️ התאמת אלרגיה בהמלצה ${rec._id} (HE):`, matches);
    }

    return newRec;
  });
}
