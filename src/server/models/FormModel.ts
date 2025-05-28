import mongoose, { Schema, Document } from "mongoose";

export interface FormDocument extends Document {
  studentId: string;
  role: "student" | "parent" | "teacher";
  formType: string; //
  answers: Record<string, string>;
  submittedAt: Date;
}

const FormSchema = new Schema<FormDocument>({

  studentId: { type: String, required: true },
  role: { type: String, enum: ["student", "parent", "teacher"], required: true },

  formType: { type: String, required: true },
  answers: { type: Schema.Types.Mixed, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const FormModel = mongoose.model<FormDocument>("Form", FormSchema);
