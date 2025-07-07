// models/StudentRecommendations.ts

import mongoose, { Schema } from "mongoose";

const TranslatedField = {
  en: { type: String, required: true },
  he: { type: String, required: true },
};

const OptionalTranslatedField = {
  en: { type: String },
  he: { type: String },
};

const StudentRecommendationsSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    recommendations: { type: Array, required: true },
    tagsUsed: { type: [String], default: [] },
    allergyList: { type: [String], default: [] },
    diagnosisTypes: { type: [String], default: [] },
    professionalSupport: { type: Boolean, default: false },
    mainDiagnosisType: { type: Object },
    subtypeDiagnosisTypes: { type: [Object] },

    // 🧠 הוספה של אבחון מרכזי ותת־אבחון
    dominantDiagnosisType: TranslatedField,
    subtypeDiagnosisType: OptionalTranslatedField,
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
