
import { Student } from "@/types/school";
import { mockStudents } from "./mock/students";

export const studentService = {
  getAllStudents: async () => {
    return new Promise<Student[]>((resolve) => {
      setTimeout(() => resolve(mockStudents), 500);
    });
  },

  getStudent: async (id: string) => {
    return new Promise<Student | undefined>((resolve) => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.id === id);
        resolve(student);
      }, 500);
    });
  },

  updateStudent: async (studentId: string, updateData: Partial<Student>) => {
    return new Promise<Student | null>((resolve) => {
      setTimeout(() => {
        const index = mockStudents.findIndex(s => s.id === studentId);
        if (index === -1) {
          resolve(null);
          return;
        }
        mockStudents[index] = { ...mockStudents[index], ...updateData };
        resolve(mockStudents[index]);
      }, 500);
    });
  },

  addStudent: async (newStudent: Omit<Student, 'id'>) => {
    return new Promise<Student>((resolve) => {
      setTimeout(() => {
        const student = {
          ...newStudent,
          id: `s${mockStudents.length + 1}`,
        } as Student;
        mockStudents.push(student);
        resolve(student);
      }, 500);
    });
  },

  deleteStudent: async (studentId: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const initialLength = mockStudents.length;
        const index = mockStudents.findIndex(s => s.id === studentId);
        if (index > -1) {
          mockStudents.splice(index, 1);
        }
        resolve(mockStudents.length < initialLength);
      }, 500);
    });
  }
};
