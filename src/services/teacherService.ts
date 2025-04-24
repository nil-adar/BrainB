import { Teacher, Student, Message } from "@/types/school";
import { dataService } from "./dataService";
import { API_BASE_URL } from "@/config/api";
import axios from "axios";
import api from "./api";

export const teacherService = {
  /**
   * Get teacher data by ID
   */
  getTeacherById: async (teacherId: string): Promise<Teacher | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      return null;
    }
  },

  /**
   * Get students for a specific teacher 
   */
  getTeacherStudents: async (teacherId: string): Promise<Student[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/students?teacherId=${teacherId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  },


  

  /**
   * Get the list of classes this teacher is assigned to
   */
  /**
 * Get the list of classes this teacher is assigned to
 */
getAssignedClasses: async (
  teacherId: string
): Promise<
  { schoolId: string; schoolName: string; classId: string; className: string }[]
> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${teacherId}/classes`);
    return response.data?.classes || [];
  } catch (error) {
    console.error("❌ Error fetching assigned classes:", error);
    return [];
  }
},



  /**
   * Send a message from teacher to parent (or vice versa)
   */
  sendMessage: async (payload: {
    senderId: string;
    senderRole: 'teacher' | 'parent';
    receiverId: string;
    message: string;
    studentId?: string | null;
  }): Promise<{ success: boolean }> => {
    const res = await axios.post('/api/messages', {
      senderId: payload.senderId,
      senderRole: payload.senderRole,
      receiverId: payload.receiverId,
      content: payload.message,
      studentId: payload.studentId,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    return { success: res.status === 201 };
  },


  /**
   * Fetch the conversation between a teacher and a parent
   */
  getMessages: async (teacherId: string, parentId: string): Promise<{
    success: boolean;
    data: any[];
  }> => {
    const res = await axios.get(`/api/messages/conversation/${teacherId}/${parentId}`);
    return { success: res.status === 200, data: res.data };
  },

  addNewStudent: async (studentData: any): Promise<{ success: boolean }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/students`, studentData);
      return { success: response.status === 201 };
    } catch (error) {
      console.error("❌ Error adding student:", error);
      return { success: false };
    }
  },
};
