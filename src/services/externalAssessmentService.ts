
import { Assessment, ExternalAssessmentResult } from "@/types/school";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { coerce } from "zod";

export const externalAssessmentService = {
 startExternalAssessment: async (studentId: string, type: string) => {
  console.log("🚀 שלב 1: התחלת יצירת אבחון לתלמיד:", studentId);

  const response = await axios.post("http://localhost:5000/api/diagnostic/create", {
    studentId,
  });

  console.log("✅ שלב 2: קיבלנו תגובה מהשרת:", response.data);

  return response.data;
}

};

    
  
  