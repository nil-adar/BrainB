import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uniqueId: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  password: string;
  isActivated?: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'parent', 'student'],
      required: true,
    },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
