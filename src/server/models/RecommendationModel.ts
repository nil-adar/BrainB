/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document } from "mongoose";

type Translated = { en: string; he: string };

export interface IRecommendation extends Document {
  _id: string;
  type?: string;
  diagnosis_type: {
    en: string | string[];
    he: string | string[];
  };

  // ⬅️ אחת בלבד, כ־איחוד (string או אובייקט מתורגם)
  category?: { en: string; he: string } | string;

  difficulty_description?: { en: string; he: string };
  recommendation: { en: string; he: string };
  example: { en: string[] | string; he: string[] | string };
  contribution: { en: string; he: string };
  tags: string[];
}

// סכמה קטנה לשדות מתורגמים
const TranslatedStringSchema = new Schema<Translated>(
  {
    en: { type: String, trim: true, required: false },
    he: { type: String, trim: true, required: false },
  },
  { _id: false }
);

// נורמליזציה שתומכת גם בערכים ישנים (string / array / אובייקט חלקי)
function normalizeTranslated(val: any): Translated | undefined {
  if (val == null) return undefined;
  if (typeof val === "string") return { en: val, he: val };
  if (Array.isArray(val)) {
    const isHeb = (s: string) => /[\u0590-\u05FF]/.test(s);
    const vals = val.filter((x) => typeof x === "string") as string[];
    const en = vals.find((s) => !isHeb(s)) ?? vals[0] ?? "";
    const he = vals.find(isHeb) ?? vals[1] ?? vals[0] ?? "";
    return { en, he };
  }
  if (typeof val === "object") {
    return {
      en: (val.en ?? "").toString(),
      he: (val.he ?? "").toString(),
    };
  }
  return undefined;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    type: { type: String },

    diagnosis_type: {
      en: { type: Schema.Types.Mixed, required: true },
      he: { type: Schema.Types.Mixed, required: true },
    },

    // ✅ הגדרה יחידה ל-category
    category: { type: TranslatedStringSchema, required: false },

    difficulty_description: { type: TranslatedStringSchema, required: false },

    recommendation: {
      en: { type: String, required: true, trim: true },
      he: { type: String, required: true, trim: true },
    },

    example: {
      en: { type: Schema.Types.Mixed, required: true },
      he: { type: Schema.Types.Mixed, required: true },
    },

    contribution: {
      en: { type: String, required: true, trim: true },
      he: { type: String, required: true, trim: true },
    },

    tags: { type: [String], required: true },
  },
  {
    strict: false, // אם עדיין זורמים שדות היסטוריים אחרים
  }
);

// ▸ נורמליזציה אוטומטית לקלט ישן + אליאס 'catagory' אם נשאר בהיסטוריה
RecommendationSchema.path("category").set(normalizeTranslated as any);

RecommendationSchema.pre("validate", function (next) {
  const doc = this as any;
  if (!doc.category && doc.catagory) {
    doc.category = normalizeTranslated(doc.catagory);
  }
  next();
});

export const RecommendationModel = mongoose.model<IRecommendation>(
  "Recommendation",
  RecommendationSchema,
  "recommendations"
);
