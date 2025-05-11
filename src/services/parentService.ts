import axios from "axios";
import { User, Student } from "@/types/school";


const authAxios = axios.create({
  baseURL: "http://localhost:5000",
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const parentService = {
  getLoggedInUser: async (): Promise<User> => {
    try {
      const res = await authAxios.get("/api/users/me");
      console.log("🧒 משתמש מהשרת:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ שגיאה בקבלת פרטי המשתמש המחובר:", error);
      throw error;
    }
  },

  getParentChildren: async (parentId: string): Promise<Student[]> => {
    try {
      const res = await authAxios.get(`/api/students/by-parent/${parentId}`);
      console.log("🧒 ילדים שהתקבלו מהשרת:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ שגיאה בשליפת ילדים של ההורה:", error);
      return [];
    }
  },
  getStudentById: async (studentId: string): Promise<Student> => {
  const res = await authAxios.get(`/api/students/${studentId}`);
  return res.data;
},
  getParentById: async (parentId: string): Promise<any> => {
    try {
      const res = await authAxios.get(`/api/parents/${parentId}`);
      return res.data;
    } catch (error) {
      console.error("❌ שגיאה בשליפת מידע הורה:", error);
      return null;
    }
  },

  updateParentInfo: async (
    parentId: string,
    updateData: Partial<{ email: string; phone: string; name: string }>
  ): Promise<boolean> => {
    try {
      await authAxios.patch(`/api/parents/${parentId}`, updateData);
      return true;
    } catch (error) {
      console.error("❌ שגיאה בעדכון פרטי הורה:", error);
      return false;
    }
  },

  sendMessageToTeacher: async (message: {
    senderId: string;
    receiverId: string;
    content: string;
    studentId?: string;
  }): Promise<boolean> => {
    try {
      await authAxios.post("/api/messages", {
        ...message,
        senderRole: "parent",
        timestamp: new Date().toISOString(),
        isRead: false,
      });
      return true;
    } catch (error) {
      console.error("❌ שגיאה בשליחת הודעה:", error);
      return false;
    }
  },
};
