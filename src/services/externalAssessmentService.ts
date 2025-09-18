import { Assessment, ExternalAssessmentResult } from "@/types/school";
import { toast } from "@/hooks/use-toast";
import api from "@/services/api"; // 👈 ייבוא מופע axios שלך במקום axios ישיר

export const externalAssessmentService = {
  startExternalAssessment: async (studentId: string, type: string) => {
    console.log("🚀 שלב 1: התחלת יצירת אבחון לתלמיד:", studentId);

    const response = await api.post("/diagnostic/create", { studentId }); // 

    console.log("✅ שלב 2: קיבלנו תגובה מהשרת:", response.data);

    return response.data;
  }
};
