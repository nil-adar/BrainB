

import mongoose, { Document, Schema } from "mongoose";

export interface IDiagnosticResult extends Document {
  studentId: mongoose.Types.ObjectId;
  percentages: number[]; // Length 4: [Combined, Hyperactive, Inattentive, None]
  dominantSubtype: string;
  timestamp: Date;
}

const DiagnosticResultSchema: Schema = new Schema<IDiagnosticResult>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  percentages: {
    type: [Number],
    validate: {
      validator: (arr: number[]) => arr.length === 4,
      message: "Percentages array must contain exactly 4 elements."
    },
    required: true
  },
  dominantSubtype: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const DiagnosticResultModel = mongoose.model<IDiagnosticResult>("DiagnosticResult", DiagnosticResultSchema);
