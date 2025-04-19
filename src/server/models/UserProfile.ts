import { Schema, model, Document, Types } from 'mongoose';

export interface IAssignedClass {
  schoolId: string;
  schoolName: string;
  classId: string;
  className: string;
  isActive?: boolean;
}

export interface IUserProfile extends Document {
  userId: Types.ObjectId;
  profilePicture?: string;
  language: 'en' | 'he';
  preferences?: Record<string, any>;
  assignedClasses: IAssignedClass[];
}

const assignedClassSchema = new Schema<IAssignedClass>(
  {
    schoolId: { type: String, required: true },
    schoolName: { type: String, required: true },
    classId: { type: String, required: true },
    className: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { _id: false }
);

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      enum: ['en', 'he'],
      default: 'he',
    },
    preferences: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    assignedClasses: {
      type: [assignedClassSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfileModel = model<IUserProfile>('UserProfile', userProfileSchema);
