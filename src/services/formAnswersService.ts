// src/services/formAnswersService.ts

import { ParentAnswerModel, TeacherAnswerModel, ChildAnswerModel } from "../server/models/Answers";
import type { IAnswer } from "../server/models/Answers";

// מחזיר את כל התגיות מכל השאלונים שנענו (של הילד, ההורה והמורה)
export async function getAllAnswersForStudent(studentId: string): Promise<string[]> {
  const [parent, teacher, child] = await Promise.all([
    ParentAnswerModel.findOne({ studentId }),
    TeacherAnswerModel.findOne({ studentId }),
    ChildAnswerModel.findOne({ studentId }),
  ]);

  const allTags = new Set<string>();

  const collectTags = (doc: IAnswer | null) => {
  if (!doc || !doc.tags) return;
  for (const tag of doc.tags) {
    allTags.add(tag);
  }
};

  collectTags(parent);
  collectTags(teacher);
  collectTags(child);

  return Array.from(allTags);
}
