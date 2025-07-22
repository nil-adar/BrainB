import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uniqueId?: string;
  name: string;           
  firstName?: string;     // 
  lastName?: string;      // 
  email?: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  password: string;
  isActivated?: boolean;
  schoolName?: string;
  classId?: string;
  className?: string;
  extraTime?: number;


  schoolId ?:string;
  parentOf?: string[];    // 
  teacherId?: string;     //  
  parentIds?: string[];   //
  grade?: string;         //
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
    extraTime: {
      type: Number,
      enum: [1, 1.25, 1.50],
      default: 1
    },
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
