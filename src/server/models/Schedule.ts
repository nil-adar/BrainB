import mongoose, { Schema, Document, model } from 'mongoose';

export interface IScheduleItem {
  time: string;
  subject?: string;
  room: string;
  topic:string;
}

export interface ISchedule extends Document {
  teacherId: mongoose.Types.ObjectId | string;
  classId?: string;
  date: Date;
  weekday?: number;
  schedule: IScheduleItem[];
  isPersonal?: boolean;
  notes?: string;
}

const ScheduleItemSchema = new Schema<IScheduleItem>({
  time: { type: String, required: true },
  subject: { type: String, required: false, maxlength: 50 },
  topic: { type: String, required: false, maxlength: 100 },
  room: { type: String, required: true },
}, { _id: false });

const ScheduleSchema = new Schema<ISchedule>({
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: String },
  date: { type: Date, required: true },
  weekday: { type: Number },
  schedule: {
    type: [ScheduleItemSchema],
    required: false,
    default:[],
    
  },
  isPersonal: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });

ScheduleSchema.index({ teacherId: 1, date: 1 }, { unique: true });

export const ScheduleModel = model<ISchedule>('Schedule', ScheduleSchema);


