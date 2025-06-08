import mongoose, { Schema, Document } from "mongoose";//sandra

export interface IRecommendation extends Document {
  diagnosis_type: 'Combined' | 'Inattentive' | 'Hyperactivity' | 'No ADHD';
  tags: string[];
  example: { he: string[] | string; en: string[] | string };
  description: { he: string; en: string };
}

const RecommendationSchema: Schema = new Schema({
  diagnosis_type: {
    type: String,
    enum: ['Combined', 'Inattentive', 'Hyperactivity', 'No ADHD'],
    required: true,
  },
  tags: { type: [String], required: true },
  example: {
    he: { type: Schema.Types.Mixed },
    en: { type: Schema.Types.Mixed }
  },
  description: {
    he: { type: String },
    en: { type: String }
  }
});

export const RecommendationModel = mongoose.model<IRecommendation>(
    'Recommendation',
     RecommendationSchema
);

