/**
 * מודול זה מגדיר את מבנה התשובות לשאלוני האבחון של הורה, מורה וילד.
 * כל תשובה נשמרת במסד הנתונים עם מזהה תלמיד (studentId), רשימת תגים (tags),
 * ואופציונלית תשובות לשאלות רב-ברירתיות (multichoiceAnswers).
 * התשובות נשמרות בשלושה אוספים נפרדים: ParentAnswer, TeacherAnswer, ChildAnswer.
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  studentId: mongoose.Types.ObjectId;
  tags: string[];
  multichoiceAnswers?: Record<string, string[]>; // תשובות רב ברירה אם תרצי
}


const answerSchema = new Schema<IAnswer>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: { type: [String], required: true },
  multichoiceAnswers: { type: Map, of: [String], default: {} },
});

export const ParentAnswerModel = mongoose.model<IAnswer>('ParentAnswer', answerSchema);
export const TeacherAnswerModel = mongoose.model<IAnswer>('TeacherAnswer', answerSchema);
export const ChildAnswerModel = mongoose.model<IAnswer>('ChildAnswer', answerSchema);


