//src\server\routes\DiagnosticResult.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDiagnosticResult extends Document {
  studentId: mongoose.Types.ObjectId;
  sessionToken?: string;
  percentages: number[]; // Length 4: [Combined, Hyperactivity, Inattention, None]
  dominantSubtype: string;
  timestamp: Date;
}

const DiagnosticResultSchema: Schema = new Schema<IDiagnosticResult>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: false },
  percentages: {
    type: [Number],
    validate: {
      validator: (arr: number[]) => arr.length === 4,
      message: "Percentages array must contain exactly 4 elements.",
    },
    required: true,
  },
  dominantSubtype: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const DiagnosticResultModel = mongoose.model<IDiagnosticResult>(
  "DiagnosticResult",
  DiagnosticResultSchema
);
