// קובץ זה אחראי לשליפת המלצות מותאמות אישית עבור תלמיד, על בסיס תוצאת האבחון האחרונה שלו 
// ומענה לשאלונים (תגיות). התוצאה הסופית היא מערך המלצות מסוננות לפי סוג האבחון ותגיות רלוונטיות.

import { DiagnosticResultModel } from "../server/models/DiagnosticResult";//sandra
import { getAllRecommendations } from "../utils/recommendationLoader";
import { getAllAnswersForStudent } from "src/services/formAnswersService";
import mongoose from "mongoose";
import { RecommendationModel, IRecommendation } from "../server/models/Recommendation";

export async function getPersonalizedRecommendations(studentId: string) {
  // 1. נשלוף את התוצאה הדומיננטית מהאבחון
  //שאילתה למסד הנתונים (MongoDB), והוא מחפש את תוצאת האבחון האחרונה של תלמיד מסוים.
  const result = await DiagnosticResultModel.findOne({ studentId }).sort({ createdAt: -1 });
  const dominantSubtype = result?.dominantSubtype;
  if (!dominantSubtype) throw new Error("Dominent outcome wasen't found");

  // 2. נטען את ההמלצות מתוך הגיליון או MongoDB
  const allRecommendations = await getAllRecommendations();

  // 3. סינון לפי סוג אבחון
  const filteredByDiagnosis = allRecommendations.filter(r => r.diagnosis_type?.en === dominantSubtype);

  // 4. נביא את כל התגיות שיצאו משאלוני הילד, הורה, מורה
  const tags = await getAllAnswersForStudent(studentId);

  // 5. סינון לפי תגיות
  const filteredByTags = filteredByDiagnosis.filter(rec =>
    rec.tags?.some((tag: string) => tags.includes(tag))
  );

  // 6. (בהמשך) נוסיף סינון לפי שאלות רב-ברירה ודוגמאות
  return filteredByTags;
}

export const RecommendationModel = mongoose.model<IRecommendation>(
  "Recommendation",
  recommendationSchema
);