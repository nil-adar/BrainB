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
  schoolName?: string;
  classId?: string;
  className?: string;
  


  schoolId ?:string;
  parentOf?: string[];    // 
  teacherId?: string;     //  
  parentIds?: string[];   //
  grade?: string;         //← 
  class?: string;         // 
  avatar?: string;        // 
  dateOfBirth?: Date;     //
  specialNeeds?: string[];// 
  subjects?: string[];
  assignedClasses?: {
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
  }[];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    uniqueId:    { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    firstName:   { type: String },      //
    lastName:    { type: String },      //
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
    classId:   { type: String },   
    className: { type: String }, 
    specialNeeds:[{ type: String }],    
    subjects:    [{ type: String }],
    assignedClasses: [
      {
        schoolId: { type: String },
        schoolName: { type: String },
        classId: { type: String },
        className: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
