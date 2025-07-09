// src/models/RecommendationModel.ts
import mongoose, { Schema, Document } from "mongoose";
/**
 * IRecommendation
 *  Defines the TypeScript interface for a recommendation document.
 *  Extends mongoose.Document to include _id and other mongoose properties.
 */
/*export interface IRecommendation extends Document {
  //The ADHD presentation subtype this recommendation applies to.
  diagnosis_type: {
    en: "Combined" | "Hyperactivity" | "Inattentive" | "Impulsivity";
    he: string;
  };
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
}*/
/**
 * RecommendationSchema
 *  Maps the IRecommendation interface to a Mongoose schema,
 *  enforcing field types, required flags, and enum values.
 */
/*const RecommendationSchema = new Schema<IRecommendation>({
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
});*/
/*Define and export the “Recommendation” Mongoose model, 
binding the TypeScript interface IRecommendation to the RecommendationSchema.
This gives you a Model you can use to query, insert, update, and delete 
recommendation documents in the “recommendations” collection.*/
/*export const RecommendationModel = mongoose.model(
  "Recommendation",
  RecommendationSchema,
  "recommendations"
);*/

/**
 * IRecommendation
 * Defines the TypeScript interface for a recommendation document.
 * Updated to match the actual data structure from the database.
 */
export interface IRecommendation extends Document {
  _id: string;
  type?: string; // נוסף - "nutrition", "physical", etc.

  // The ADHD presentation subtype this recommendation applies to
  diagnosis_type: {
    en: string | string[]; // יכול להיות מחרוזת או מערך
    he: string | string[];
  };

  // Category of recommendation - note: there's a typo in the actual data (catagory)
  category?: string;
  catagory?: {
    en: string;
    he: string;
  };

  // Description of the difficulty this recommendation addresses
  difficulty_description?: {
    en: string;
    he: string;
  };

  // The actual recommendation text
  recommendation: {
    en: string;
    he: string;
  };

  // Examples that illustrate the recommendation
  example: {
    en: string[] | string;
    he: string[] | string;
  };

  // How this recommendation contributes to improvement
  contribution: {
    en: string;
    he: string;
  };

  // Tags used to match against questionnaire answers
  tags: string[];
}

/**
 * RecommendationSchema
 * Updated schema to match the actual data structure
 */
const RecommendationSchema = new Schema<IRecommendation>(
  {
    type: {
      type: String,
      required: false,
    },

    diagnosis_type: {
      en: { type: Schema.Types.Mixed, required: true }, // Mixed to handle both string and array
      he: { type: Schema.Types.Mixed, required: true },
    },

    category: {
      type: String,
      required: false,
    },

    catagory: {
      en: { type: String, required: false },
      he: { type: String, required: false },
    },

    difficulty_description: {
      en: { type: String, required: false },
      he: { type: String, required: false },
    },

    recommendation: {
      en: { type: String, required: true },
      he: { type: String, required: true },
    },

    example: {
      en: { type: Schema.Types.Mixed, required: true }, // Mixed to handle both string and array
      he: { type: Schema.Types.Mixed, required: true },
    },

    contribution: {
      en: { type: String, required: true },
      he: { type: String, required: true },
    },

    tags: {
      type: [String],
      required: true,
    },
  },
  {
    // Preserve existing field names (including typos like 'catagory')
    strict: false,
  }
);

/*
 * Define and export the "Recommendation" Mongoose model,
 * binding the updated TypeScript interface to the schema.
 */
export const RecommendationModel = mongoose.model<IRecommendation>(
  "Recommendation",
  RecommendationSchema,
  "recommendations"
);
