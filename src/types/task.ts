// src/types/task.ts

export interface Task {
  id: number;
  title: string;
  minutes: number;
  color: string;
  stars: number;
  completed: boolean;
  category: string;
  success?: boolean;
  studentId?: string;     // אם מאוחסן לפי תלמיד
  date?: string;          // YYYY-MM-DD
}
