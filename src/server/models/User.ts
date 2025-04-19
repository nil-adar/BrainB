import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uniqueId?: string;
  name: string;           // יכול לשמש לשם מלא או תחליף ל־firstName/lastName
  firstName?: string;     // ← חדש
  lastName?: string;      // ← חדש
  email?: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  password: string;
  isActivated?: boolean;
  parentOf?: string[];    // הורה: מזהי ילדים
  teacherId?: string;     // ← חדש: המורה של התלמיד
  parentIds?: string[];   // ← חדש: רשימת ההורים של התלמיד
  grade?: string;         // ← חדש
  class?: string;         // ← חדש (שם הכיתה)
  avatar?: string;        // ← חדש: URL לתמונה
  dateOfBirth?: Date;     // ← חדש
  specialNeeds?: string[];// ← חדש
  subjects?: string[];
  assignedClasses?: string[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    uniqueId:    { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    firstName:   { type: String },      // ← הוסף
    lastName:    { type: String },      // ← הוסף
    email:       { type: String },
    phone:       { type: String },
    role:        {
                  type: String,
                  enum: ['admin','teacher','parent','student'],
                  required: true
                },
    password:    { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    parentOf:    [{ type: String }],    
    teacherId:   { type: String },     
    parentIds:   [{ type: String }],   
    grade:       { type: String },      
    class:       { type: String },      
    avatar:      { type: String },     
    dateOfBirth: { type: Date },       
    specialNeeds:[{ type: String }],    
    subjects:    [{ type: String }],
    assignedClasses:[{ type: String }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
