import axios from "axios";
import { Assessment, ExternalAssessmentResult } from "@/types/school";

export const externalAssessmentService = {
  startExternalAssessment: async (studentId: string, type: string) => {
    console.log("🚀 שלב 1: התחלת יצירת אבחון לתלמיד:", studentId);

    const response = await axios.post("http://localhost:5000/api/diagnostic/create", {
      studentId,
      type
    });

    console.log("✅ שלב 2: קיבלנו תגובה מהשרת:", response.data);

    return response.data;
  },

  getAssessmentStatus: async (assessmentId: string): Promise<Assessment | null> => {
    try {
      const response = await axios.get(`http://localhost:5000/api/diagnostic/status/${assessmentId}`);
      return response.data;
    } catch (error) {
      console.error("❌ שגיאה בשליפת סטטוס אבחון:", error);
      return null;
    }
  },

  receiveExternalResults: async (externalSystemId: string): Promise<ExternalAssessmentResult | null> => {
    try {
      const response = await axios.get(`http://localhost:5000/api/diagnostic/results/${externalSystemId}`);
      return response.data;
    } catch (error) {
      console.error("❌ שגיאה בקבלת תוצאות אבחון:", error);
      return null;
    }
  }
};
