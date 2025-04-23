import api from './api';
import { DailyTask } from './dailyTasksService';

export const dailyTasksService = {
  getStudentTasks: async (studentId: string, date: string): Promise<DailyTask[]> => {
    try {
      const res = await api.get(`/api/students/${studentId}/tasks`, { params: { date } });
      return res.data;
    } catch (error) {
      console.error("Error fetching student tasks:", error);
      return [];
    }
  },

  saveTasks: async (tasks: DailyTask[], studentId: string, date: string): Promise<boolean> => {
    try {
      await api.post(`/api/students/${studentId}/tasks`, { date, tasks });
      return true;
    } catch (error) {
      console.error("Error saving tasks:", error);
      return false;
    }
  },

  saveTasksForClass: async (tasks: Omit<DailyTask, "studentId">[], classId: string, date: string): Promise<boolean> => {
    try {
      await api.post(`/api/classes/${classId}/tasks`, { date, tasks });
      return true;
    } catch (error) {
      console.error("Error saving class tasks:", error);
      return false;
    }
  },
};
