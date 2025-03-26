
import { Task } from "@/types/school";
import { mockStudents } from "./mock/students";

export const taskService = {
  addTask: async (studentId: string, task: Omit<Task, 'id' | 'studentId'>) => {
    return new Promise<Task | null>((resolve) => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.id === studentId);
        if (!student) {
          resolve(null);
          return;
        }
        const newTask: Task = {
          ...task,
          id: `t${Date.now()}`,
          studentId
        };
        student.tasks.push(newTask);
        resolve(newTask);
      }, 500);
    });
  },

  updateTask: async (taskId: string, updateData: Partial<Task>) => {
    return new Promise<Task | null>((resolve) => {
      setTimeout(() => {
        for (const student of mockStudents) {
          const taskIndex = student.tasks.findIndex(t => t.id === taskId);
          if (taskIndex > -1) {
            student.tasks[taskIndex] = { ...student.tasks[taskIndex], ...updateData };
            resolve(student.tasks[taskIndex]);
            return;
          }
        }
        resolve(null);
      }, 500);
    });
  }
};
