import api from "@/services/api";
import { User, Student } from "@/types/school";

export const parentService = {
  getLoggedInUser: async (): Promise<User> => {
    try {
      const res = await api.get("/users/me");
      console.log("🧒 משתמש מהשרת:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ שגיאה בקבלת פרטי המשתמש המחובר:", error);
      throw error;
    }
  },

  getParentChildren: async (parentId: string): Promise<Student[]> => {
    try {
      const res = await api.get(`/students/by-parent/${parentId}`);
      console.log("🧒 ילדים שהתקבלו מהשרת:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ שגיאה בשליפת ילדים של ההורה:", error);
      return [];
    }
  },

  getStudentById: async (studentId: string): Promise<Student> => {
    const res = await api.get(`/students/${studentId}`);
    return res.data;
  },

  getParentById: async (parentId: string): Promise<any> => {
    try {
      const res = await api.get(`/parents/${parentId}`);
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
      await api.patch(`/parents/${parentId}`, updateData);
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
      await api.post("/messages", {
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
