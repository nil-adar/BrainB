/**
 * פונקציה זו מבצעת סינון של המלצות על סמך תגיות (tags) שהופעלו בשאלונים של הורה, מורה וילד.
 * היא אוספת את כל התגיות שבהן נבחרו ערכים גבוהים (2 או 3), ומחזירה רק את ההמלצות שהתאימו לתגיות האלו.
 * מיועדת לשלב 2 בתהליך הסינון האישי של המלצות לסטודנט לפי התנהגותו.
 */
//sandra
import { RecommendationModel as Recommendation } from "src/server/models/Recommendation";
import { IAnswer } from "src/server/models/Answers";
import { IRecommendation } from "src/server/models/Recommendation";


export function filterByTags(
  recommendations: IRecommendation[],
  parentAnswers: IAnswer | null,
  teacherAnswers: IAnswer | null,
  childAnswers: IAnswer | null
): IRecommendation[] {


  const activeTags = new Set<string>();

  // איסוף כל התגיות שהופעלו מתוך השאלות שהיו עם תשובות 2 או 3
  const collectTags = (answers: any) => {
    if (!answers || !answers.answers) return;
    for (const answer of answers.answers) {
      if ([2, 3].includes(answer.value) && answer.tag) {
        activeTags.add(answer.tag);
      }
    }
  };

  collectTags(parentAnswers);
  collectTags(teacherAnswers);
  collectTags(childAnswers);

  // החזרת המלצות שרק לפחות אחת מהתגיות שלהן קיימת ב־activeTags
  const filtered = recommendations.filter(rec => {
    if (!rec.tags || rec.tags.length === 0) return false;
    return rec.tags.some(tag => activeTags.has(tag));
  });

  return filtered;
}
