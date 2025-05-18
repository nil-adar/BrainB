import mongoose, { Schema, Document } from "mongoose";

export interface IDiagnosticSession extends Document {
  studentId: mongoose.Types.ObjectId;
  sessionToken: string;
  createdAt: Date;
  expiresAt: Date;
  status: "pending" | "completed" | "expired";
}

const DiagnosticSessionSchema = new Schema<IDiagnosticSession>({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming students are in the User collection
    required: true,
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "expired"],
    default: "pending",
  },
});

export const DiagnosticSessionModel = mongoose.model<IDiagnosticSession>(
  "DiagnosticSession",
  DiagnosticSessionSchema
);
