
// Basic user types
export interface User {
  id: string;              
  uniqueId: string;     
  _id: string;
   
  name: string;
  email: string;
  phone: string;           // מספר טלפון
  role: 'teacher' | 'parent' | 'student' | 'admin';
  password: string;
}

export interface Parent extends User {
  childrenIds: string[];
  children?: Student[];
  questionnaires: Questionnaire[];
}

export interface Teacher extends User {
  teacherId: string;
  assignedClass: string;
}

export interface Student extends User {
  userId: string;         // שם משתמש להתחברות
  firstName: string;
  lastName: string;
  class: string;
  grade: string;
  classId: string;
  teacherId: string; 
  dateOfBirth: string;
  parentIds: string[];
  avatar?: string;
  tasks: Task[];
  className: string; 
  progressReports: Report[];
  extraTime?: number; // 
}

// Assessment related types
export interface Assessment {
  id: string;
  type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'evaluated';
  result?: string;
  studentId: string;
  externalSystemId?: string;
  startedAt?: string;
  completedAt?: string;
  externalSystemUrl?: string;
}

export interface Questionnaire {
  id: string;
  questions: string[];
}

// Task related types
export interface Task {
  id: string;
  description: string;
  completed: boolean;
  studentId: string;
}

// Report related types
export interface Report {
  id: string;
  studentId: string;
  content: string;
  recommendations: string[];
  completed: boolean;
}

// Message related types
export interface Message {
  createdAt?: string;
  _id?: string;
  id: string;
  senderId: string;
  studentId: string;
  receiverId: string;
  content: string;
  studentName?: string;
  timestamp: string;
  isRead: boolean;
  senderRole: 'teacher' | 'parent';
}

// Notification related types
export interface Notification {
  id: string;
  parentId: string;
  studentId: string; // 
  studentName: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "message" | "assessment";
  isChecked: boolean;
  color: string;
}



// Data structure for the entire school
export interface SchoolData {
  students: Student[];
  parents: Parent[];
  teachers: Teacher[];
  tasks: Task[];
  assessments: Assessment[];
  reports: Report[];
  questionnaires: Questionnaire[];
  messages: Message[];
}

// Auth Types
export interface AuthResponse {
  user: User | null;
  error?: string;
}

export interface LoginCredentials {
  uniqueId: string;
  password: string;
}

// External Assessment System
export interface ExternalAssessmentSystem {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
}

export interface ExternalAssessmentResult {
  externalSystemId: string;
  studentId: string;
  assessmentType: string;
  score: number;
  details: Record<string, any>;
  timestamp: string;
}

