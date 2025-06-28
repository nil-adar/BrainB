import mongoose, { Schema, Document } from "mongoose";

export interface AnswerObject {
  answer: string | string[];
  tag?: string;
  type?: string;
  text?: {
    en?: string;
    he?: string;
  };
}

export interface FormDocument extends Document {
  studentId: string;
  role: "student" | "parent" | "teacher";
  questionnaireId: string; // איזה שאלון היה
  answers: AnswerObject[]; // תשובות מחרוזת/-string[]
  //answers: Record<string, AnswerObject>; // תשובות מחרוזת/-string[]
  tags?: string[]; // אם שומרים תגיות
  submittedAt: Date;
}

const FormSchema = new Schema<FormDocument>(
  {
    studentId: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "parent", "teacher"],
      required: true,
    },
    questionnaireId: { type: String, required: true }, // new
    answers: { type: Schema.Types.Mixed, required: true },
    tags: { type: [String], default: undefined }, // optional
    submittedAt: { type: Date, default: Date.now },
  },
  {
    collection: "forms",
  }
);

export const FormModel = mongoose.model<FormDocument>("Form", FormSchema);
