import { Task, Assessment, Report, Questionnaire } from "@/types/school";

export const mockTasks: Task[] = [
  {
    id: "task1",
    description: "להשלים תרגילי חשבון",
    completed: false,
    studentId: "1"
  },
  {
    id: "task2",
    description: "לקרוא פרק בספר",
    completed: true,
    studentId: "2"
  }
];

export const mockAssessments: Assessment[] = [
  {
    id: "assessment1",
    type: "reading",
    status: "completed" as const,
    result: JSON.stringify({
      score: 85,
      strengths: ["מהירות קריאה טובה", "הבנת הוראות"],
      weaknesses: ["שגיאות כתיב", "קושי בהבנת טקסטים מורכבים"]
    }),
    studentId: "s1" // Add the required studentId property
  },
  {
    id: "assessment2",
    type: "writing",
    status: "pending" as const,
    studentId: "s2" // Add the required studentId property
  }
];

export const mockReports: Report[] = [
  {
    id: "r1",
    studentId: "1",
    content: "התלמידה מתקדמת יפה בחשבון",
    recommendations: ["תרגול נוסף בגיאומטריה", "חיזוק הבנת הנקרא"],
    completed: true
  }
];

export const mockQuestionnaires: Questionnaire[] = [
  {
    id: "q1",
    questions: [
      "האם הילד/ה נהנה/ת בבית הספר?",
      "האם יש קשיים בהכנת שיעורי בית?"
    ]
  }
];
