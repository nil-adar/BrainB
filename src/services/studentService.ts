// src/services/studentService.ts
import api from "./api";           // זה יכול להיות axios.create({ baseURL: ... })
import { Student } from "@/types/school";
import { User } from "@/types/school";

const STUDENTS_API = "/api/students";

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
 getStudentById: async (id: string): Promise<User | null> => {
  try {
    const res = await api.get(`/students/${id}`);
    return res.data;


    const user = res.data;
    if (user.role !== "student") return null;
    return user;
  } catch (err) {
    console.error(`Error fetching user ${id}:`, err);
    return null;
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
  }
};
