// src/models/RecommendationModel.ts
import mongoose, { Schema, Document } from "mongoose";
/**
 * IRecommendation
 *  Defines the TypeScript interface for a recommendation document.
 *  Extends mongoose.Document to include _id and other mongoose properties.
 */
export interface IRecommendation extends Document {
  //The ADHD presentation subtype this recommendation applies to.
  diagnosis_type: "Combined" | "Inattentive" | "Hyperactivity" | "Impulsivity";
  tags: string[]; //An array of strings used to match this recommendation against questionnaire answers that “trigger” it.
  example: {
    //that illustrate the recommendation. Used for filtering by exclusions.
    he: string[] | string;
    en: string[] | string;
  };
  description: {
    // The actual recommendation text, in both Hebrew and English.
    he: string;
    en: string;
  };
}
/**
 * RecommendationSchema
 *  Maps the IRecommendation interface to a Mongoose schema,
 *  enforcing field types, required flags, and enum values.
 */
const RecommendationSchema = new Schema<IRecommendation>({
  diagnosis_type: {
    type: String,
    enum: ["Combined", "Inattentive", "Hyperactivity", "Impulsivity"],
    required: true,
  },
  tags: { type: [String], required: true },
  example: {
    he: { type: Schema.Types.Mixed, required: true },
    en: { type: Schema.Types.Mixed, required: true },
  },
  description: {
    he: { type: String, required: true },
    en: { type: String, required: true },
  },
});
/*Define and export the “Recommendation” Mongoose model, 
binding the TypeScript interface IRecommendation to the RecommendationSchema.
This gives you a Model you can use to query, insert, update, and delete 
recommendation documents in the “recommendations” collection.*/
export const RecommendationModel = mongoose.model(
  "Recommendation",
  RecommendationSchema,
  "recommendations"
);
