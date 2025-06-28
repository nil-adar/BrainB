// src/models/QuestionModel.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  tag: string;
  text: {
    he: string;
    en: string;
  };
  options: Array<{
    id: string;
    value: string | number;
  }>;
  multiple: boolean; // true if multi-select, false if single-choice
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
  text: {
    he: { type: String, required: true },
    en: { type: String, required: true },
  },
  options: [
    {
      id: { type: String, required: true },
      value: Schema.Types.Mixed,
    },
  ],
  multiple: { type: Boolean, required: true },
});

export const QuestionModel = mongoose.model<IQuestion>(
  "Question",
  QuestionSchema
);
