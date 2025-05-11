
import { Assessment, ExternalAssessmentResult } from "@/types/school";
import { toast } from "@/hooks/use-toast";

// הגדרה של המערכות החיצוניות - החלף את ה-URLs האלה עם ה-URLs האמיתיים של המערכות שלך
const externalSystems = {
  behavioral: {
    name: "מערכת אבחון התנהגות",
    baseUrl: "https://your-behavioral-system-url.com", // שנה ל-URL האמיתי
    apiKey: "your-api-key", // הוסף מפתח API אם נדרש
    returnUrl: window.location.origin + "/assessment-complete"
  },
  cognitive: {
    name: "מערכת אבחון קוגניטיבי",
    baseUrl: "https://your-cognitive-system-url.com", // שנה ל-URL האמיתי
    apiKey: "your-api-key", // הוסף מפתח API אם נדרש
    returnUrl: window.location.origin + "/assessment-complete"
  },
  reading: {
    name: "מערכת אבחון קריאה",
    baseUrl: "https://your-reading-system-url.com", // שנה ל-URL האמיתי
    apiKey: "your-api-key", // הוסף מפתח API אם נדרש
    returnUrl: window.location.origin + "/assessment-complete"
  }
};

// רשימה של אבחונים שמחכים לתוצאות
let pendingAssessments: Assessment[] = [];

export const externalAssessmentService = {
  // התחלת אבחון במערכת חיצונית
  startExternalAssessment: async (studentId: string, assessmentType: string): Promise<Assessment> => {
    try {
      const system = externalSystems[assessmentType as keyof typeof externalSystems];
      if (!system) {
        throw new Error(`סוג אבחון לא נתמך: ${assessmentType}`);
      }

      // יצירת מזהה ייחודי לאבחון
      const externalSystemId = `ext-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // במימוש אמיתי: שליחת בקשה לשרת החיצוני להתחלת אבחון
      // const response = await fetch(`${system.baseUrl}/api/start-assessment`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${system.apiKey}`
      //   },
      //   body: JSON.stringify({
      //     studentId,
      //     sessionId: externalSystemId,
      //     returnUrl: system.returnUrl
      //   })
      // });
      
      // כרגע אנחנו לא שולחים בקשה אמיתית, אלא יוצרים URL עם פרמטרים
      const externalSystemUrl = `${system.baseUrl}/start?session=${externalSystemId}&student=${studentId}&returnUrl=${encodeURIComponent(system.returnUrl)}`;
      
      // יצירת אבחון חדש
      const assessment: Assessment = {
        id: `assessment-${Date.now()}`,
        studentId,
        type: assessmentType,
        status: 'in_progress',
        externalSystemId,
        startedAt: new Date().toISOString(),
        externalSystemUrl
      };
      
      // שמירת האבחון ברשימה המקומית
      pendingAssessments.push(assessment);
      
      // החזרת מידע על האבחון
      return assessment;
    } catch (error) {
      console.error("שגיאה בהתחלת אבחון חיצוני:", error);
      throw error;
    }
  },
  
  // קבלת סטטוס אבחון לפי מזהה
  getAssessmentStatus: async (assessmentId: string): Promise<Assessment | null> => {
    try {
      // במימוש אמיתי: שליחת בקשה לשרת כדי לקבל את הסטטוס העדכני
      // נשתמש במזהה האבחון ונבדוק במערכת החיצונית
      
      // כרגע אנחנו רק מחזירים את האבחון מהרשימה המקומית
      const assessment = pendingAssessments.find(a => a.id === assessmentId);
      return assessment || null;
    } catch (error) {
      console.error("שגיאה בקבלת סטטוס אבחון:", error);
      return null;
    }
  },
  
  // קבלת תוצאות אבחון מהמערכת החיצונית
  receiveExternalResults: async (externalSystemId: string): Promise<ExternalAssessmentResult | null> => {
    try {
      const assessment = pendingAssessments.find(a => a.externalSystemId === externalSystemId);
      
      if (!assessment) {
        console.error("לא נמצא אבחון עם המזהה:", externalSystemId);
        return null;
      }
      
      const system = externalSystems[assessment.type as keyof typeof externalSystems];
      
      // במימוש אמיתי: שליחת בקשה לשרת החיצוני לקבלת התוצאות
      // const response = await fetch(`${system.baseUrl}/api/results/${externalSystemId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${system.apiKey}`
      //   }
      // });
      // const resultData = await response.json();
      
      // כרגע, נדמה תוצאות
      const resultData = {
        score: Math.floor(Math.random() * 100),
        strengths: ["יכולת ניתוח גבוהה", "הבנת הוראות טובה"],
        weaknesses: ["קושי בהתמקדות לאורך זמן", "עיבוד מידע איטי"],
        recommendations: [
          "המלצה לתרגול יומי של 15 דקות",
          "עבודה בקבוצות קטנות",
          "שימוש באמצעי המחשה"
        ]
      };
      
      // יצירת אובייקט תוצאות מובנה
      const mockResult: ExternalAssessmentResult = {
        externalSystemId,
        studentId: assessment.studentId,
        assessmentType: assessment.type,
        score: resultData.score,
        details: {
          strengths: resultData.strengths,
          weaknesses: resultData.weaknesses,
          recommendations: resultData.recommendations
        },
        timestamp: new Date().toISOString()
      };
      
      // עדכון סטטוס האבחון
      assessment.status = 'completed';
      assessment.completedAt = new Date().toISOString();
      assessment.result = JSON.stringify(mockResult);
      
      // שמירת השינויים
      pendingAssessments = pendingAssessments.map(a => 
        a.id === assessment.id ? assessment : a
      );
      
      toast({
        title: "האבחון הושלם",
        description: `תוצאות האבחון מסוג ${assessment.type} התקבלו`,
      });
      
      return mockResult;
    } catch (error) {
      console.error("שגיאה בקבלת תוצאות אבחון:", error);
      return null;
    }
  },
  
  // שמירת תוצאות האבחון במערכת שלנו
  saveAssessmentResults: async (assessmentId: string, results: ExternalAssessmentResult): Promise<boolean> => {
    try {
      // במימוש אמיתי: שליחת בקשה לשרת שלנו לשמירת התוצאות במסד הנתונים
      // const response = await fetch('/api/assessments/save-results', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     assessmentId,
      //     results
      //   })
      // });
      // return response.ok;
      
      // כרגע אנחנו רק מעדכנים את הרשימה המקומית
      const assessmentIndex = pendingAssessments.findIndex(a => a.id === assessmentId);
      
      if (assessmentIndex > -1) {
        pendingAssessments[assessmentIndex].status = 'evaluated';
        pendingAssessments[assessmentIndex].result = JSON.stringify(results);
        return true;
      } else {
        console.error("לא נמצא אבחון עם המזהה:", assessmentId);
        return false;
      }
    } catch (error) {
      console.error("שגיאה בשמירת תוצאות אבחון:", error);
      return false;
    }
  },
  
  // קבלת כל האבחונים של תלמיד
  getStudentAssessments: async (studentId: string): Promise<Assessment[]> => {
    try {
      // במימוש אמיתי: שליחת בקשה לשרת שלנו לקבלת כל האבחונים של תלמיד
      // const response = await fetch(`/api/students/${studentId}/assessments`);
      // return await response.json();
      
      // כרגע אנחנו רק מחזירים מהרשימה המקומית
      const assessments = pendingAssessments.filter(a => a.studentId === studentId);
      return assessments;
    } catch (error) {
      console.error("שגיאה בקבלת אבחוני תלמיד:", error);
      return [];
    }
  }
};
