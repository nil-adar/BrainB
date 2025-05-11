
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherProfile extends Document {
  userId: mongoose.Types.ObjectId;
  teacherId: string;
  subjects: string[];
  assignedClasses: {
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
    isActive: boolean;
  }[];
  education?: string;
  experience?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TeacherProfileSchema = new Schema<ITeacherProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: String,
  subjects: [String],
  assignedClasses: [{
    schoolId: String,
    schoolName: String,
    classId: String,
    className: String,
    isActive: Boolean
  }],
  education: String,
  experience: Number
}, { timestamps: true });

export const TeacherProfile = mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
