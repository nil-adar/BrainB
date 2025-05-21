import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyTask extends Document {
  title: string;
  notes?: string;
  color: string;
  minutes: number;
  stars: number;
  completed: boolean;
  studentId?: mongoose.Types.ObjectId | null;
  classId: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DailyTaskSchema = new Schema<IDailyTask>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", default: null }, // יכול להיות ריק למשימות כלליות
  classId: { type: String, required: true }, // מזהה הכיתה כשם או ID מחרוזת
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  notes: String,
  color: String,
  minutes: Number,
  stars: Number,
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const DailyTaskModel = mongoose.model<IDailyTask>('DailyTask', DailyTaskSchema);