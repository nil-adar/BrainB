// models/StudentRecommendations.ts
import mongoose, { Schema } from "mongoose";

const TranslatedFieldSchema = new Schema(
  {
    en: { type: String, required: true },
    he: { type: String, required: true },
  },
  { _id: false }
);

const DiagnosisTypeRoleSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Inattention", "Hyperactivity", "Impulsivity", "Combined"],
    },
    role: { type: String, required: true, enum: ["primary", "secondary"] },
  },
  { _id: false }
);

const StudentRecommendationsSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
      index: true,
    },

    // התוצרים להצגה
    recommendations: { type: [Schema.Types.Mixed], default: [] },
    tagsUsed: { type: [String], default: [] },
    allergyList: { type: [String], default: [] },

    professionalSupport: { type: Boolean, default: false },

    // סיכום אבחנתי
    diagnosisTypes: { type: [String], default: [] }, // לדוגמה: ["Inattention","Impulsivity"]
    mainDiagnosisType: { type: String }, // לדוגמה: "Inattention"  (היה Object → עכשיו String)
    subtypeDiagnosisTypes: { type: [String], default: [] }, // היה [Object] → עכשיו [String]

    // תרגום הסוג הדומיננטי (נשאר)
    dominantDiagnosisType: TranslatedFieldSchema,

    // חדש: רשימת סוגים עם תפקיד (ראשי/משני)
    diagnosisTypesDetailed: {
      type: [DiagnosisTypeRoleSchema],
      default: [],
    },

    // בחירת משתמש כברירת מחדל (להציג רק ראשי/שניהם)
    viewPreference: { type: String, enum: ["main", "both"], default: "main" },

    // אופציונלי: מונים פר סוג להצגת טאבס מהר (אפשר גם לחשב בכל רענון)
    countsByType: {
      type: Map,
      of: Number,
      default: undefined,
    },
  },
  {
    timestamps: true,
    collection: "SavedRecommendations",
  }
);

export const StudentRecommendationsModel = mongoose.model(
  "SavedRecommendations",
  StudentRecommendationsSchema
);
