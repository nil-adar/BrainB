// src/services/studentService.ts
import api from "./api";           // זה יכול להיות axios.create({ baseURL: ... })
import { Student } from "@/types/school";
import { User } from "@/types/school";
import axios from "axios";
import { Task } from "@/types/task";

const STUDENTS_API = "students";

export const studentService = {
  /**
   * משוך את כל התלמידים של מורה מסוים
   */
  getTeacherStudents: async (teacherId: string): Promise<Student[]> => {
    try {
      const res = await api.get<Student[]>(STUDENTS_API, {
        params: { teacherId }
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching teacher's students:", err);
      return [];
    }
  },

  /**
   * משוך תלמיד בודד לפי ID
   */
getStudentById: async (id: string): Promise<Student> => {
    try {
      const res = await api.get(`/students/${id}`);
      const user = res.data;


      return user as Student;
    } catch (err) {
      console.error(`Error fetching student ${id}:`, err);
      throw err;
    }
  },

  getStudentTasks: async (studentId: string, date: string): Promise<Task[]> => {
  try {
    const res = await api.get<Task[]>(`/tasks/${studentId}`, {
    
      params: { date }
    });
    return res.data;
  } catch (err) {
    console.error(`Error fetching tasks for student ${studentId}:`, err);
    return [];
  }
},


  /**
   * הוסף תלמיד חדש (נזקק ל־POST /api/students)
   */
  addStudent: async (newStudent: Omit<Student, "id">): Promise<Student | null> => {
    try {
      const res = await api.post<Student>(STUDENTS_API, newStudent);
      return res.data;
    } catch (err) {
      console.error("Error adding student:", err);
      return null;
    }
  },

  /**
   * עדכן תלמיד קיים (נזקק ל־PUT /api/students/:id)
   */
  updateStudent: async (studentId: string, updates: Partial<Student>): Promise<Student | null> => {
    try {
      const res = await api.put<Student>(`${STUDENTS_API}/${studentId}`, updates);
      return res.data;
    } catch (err) {
      console.error(`Error updating student ${studentId}:`, err);
      return null;
    }
  },

  /**
   * מחק תלמיד (נזקק ל־DELETE /api/students/:id)
   */
  deleteStudent: async (studentId: string): Promise<boolean> => {
    try {
      await api.delete(`${STUDENTS_API}/${studentId}`);
      return true;
    } catch (err) {
      console.error(`Error deleting student ${studentId}:`, err);
      return false;
    }
  },

  getStudentsByClass: async (classId: string): Promise<Student[]> => {
  try {
    const res = await api.get<Student[]>(`${STUDENTS_API}/by-class/${classId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching students by class:", err);
    return [];
  }
},
updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
  try {
    const res = await api.put<Task>(`/tasks/${taskId}`, updates);
    return res.data;
  } catch (err) {
    console.error(`Error updating task ${taskId}:`, err);
    return null;
  }
},

deleteTask: async (taskId: string): Promise<boolean> => {
  try {
    await api.delete(`/tasks/${taskId}`);
    return true;
  } catch (err) {
    console.error(`Error deleting task ${taskId}:`, err);
    return false;
  }
},

checkFormStatus: async (studentId: string): Promise<{ hasTeacherForm: boolean }> => {
  try {
    const res = await api.get(`/forms/check-status/${studentId}`);
    return res.data;
  } catch (err) {
    console.error(`Error checking form status for student ${studentId}:`, err);
    return { hasTeacherForm: false }; //      יש שגיאה
  }
},




};