import mongoose, { Document, Schema } from 'mongoose';

export interface IDiagnosticResult extends Document {
  studentId: mongoose.Types.ObjectId; // מזהה תלמיד ממסד הנתונים
  sessionToken: string;               //   
  percentages: number[];             // מערך  4 התוצאות הגולמיות
  dominantSubtype: 'Combined' | 'Hyperactivity' | 'Inattentive' | 'No ADHD';
  createdAt: Date;
}

const DiagnosticResultSchema = new Schema<IDiagnosticResult>({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // בהנחה שכל התלמידים נמצאים באוסף users
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true,
  },
  percentages: {
    type: [Number],
    required: true,
    validate: {
      validator: (arr: number[]) => arr.length === 4,
      message: 'percentages must be an array of length 4',
    },
  },
  dominantSubtype: {
    type: String,
    enum: ['Combined', 'Hyperactivity', 'Inattentive', 'No ADHD'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const DiagnosticResultModel = mongoose.model<IDiagnosticResult>(
  'DiagnosticResult',
  DiagnosticResultSchema
);
