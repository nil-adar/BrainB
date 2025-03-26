
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  uniqueId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true,
    enum: ['teacher', 'parent', 'student', 'admin']
  },
  password: { 
    type: String, 
    required: true 
  },
  childrenIds: {
    type: [String],
    default: []
  },
  teacherId: String,
  assignedClass: String,
  grade: String,
  dateOfBirth: String,
  parentIds: {
    type: [String],
    default: []
  },
  tasks: [{
    id: String,
    description: String,
    completed: Boolean,
    studentId: String
  }],
  progressReports: [{
    id: String,
    studentId: String,
    content: String,
    recommendations: [String],
    completed: Boolean
  }]
}, {
  timestamps: true
});

export const UserModel = model('User', userSchema);
