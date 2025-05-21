import axios from "axios";

export interface DailyTask {
  title: string;
  notes?: string;
  studentId?: string;
  classId: string;
  schoolId: string;
  date: Date | string;
  completed?: boolean;
  color: string;
  minutes: number;
  stars: number;
  createdBy: string;
}

export const dailyTasksService = {
  // שמירת משימות (לכיתה או לסטודנט)
  saveTasks: async (tasks: DailyTask[]) => {
    try {
      const response = await axios.post("/api/tasks", tasks);
      return response.data;
    } catch (error) {
      console.error("❌ שגיאה בשליחת המשימות לשרת:", error);
      throw error;
    }
  },

  // קבלת משימות לפי studentId + תאריך
  getTasksForStudent: async (studentId: string, date: string, classId?: string) => {
    try {
      const response = await axios.get(`/api/tasks/${studentId}`, {
        params: { date, classId }
      });
      return response.data;
    } catch (error) {
      console.error("❌ שגיאה בקבלת משימות מהשרת:", error);
      throw error;
    }
  }
};
