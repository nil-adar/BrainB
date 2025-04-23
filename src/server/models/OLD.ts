
import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  grade: string;
  class: string;
  teacherId: mongoose.Types.ObjectId;
  parentIds: mongoose.Types.ObjectId[];
  dateOfBirth?: Date;
  avatar?: string;
  specialNeeds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: String,
  lastName: String,
  grade: String,
  class: String,
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
  parentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dateOfBirth: Date,
  avatar: String,
  specialNeeds: [String]
}, { timestamps: true });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
