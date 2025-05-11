import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Student } from "@/types/school"; // ודא שהטיפוס Student מיובא ונכון

// הגדרת ה-Props שהקומפוננטה מקבלת
interface ChildrenProgressSectionProps {
  students: Student[]; // מערך של אובייקטי תלמידים
  // פונקציה שתופעל בלחיצה על כפתור יצירת קשר
  // מקבלת: ID של המורה, ID של התלמיד, שם מלא של התלמיד
  onContactTeacher: (teacherId: string, studentId: string, studentName: string) => void;
  // אובייקט עם מחרוזות התרגום הנדרשות
  translations: {
    childProgress: string; // כותרת הסעיף
    contactTeacher: string; // טקסט לכפתור
    noChildren?: string; // אופציונלי: הודעה כשאין ילדים
    classLabel?: string; // אופציונלי: התווית לפני מספר הכיתה
  };
}

export const ChildrenProgressSection = ({
  students,
  onContactTeacher,
  translations: t, // שימוש בכינוי t לנוחות
}: ChildrenProgressSectionProps) => {
  return (
    <section className="mt-8">
      {/* כותרת הסעיף */}
      <h2 className="text-xl font-bold mb-4">{t.childProgress}</h2>

      {/* הצגת הודעה אם אין תלמידים */}
      {/* שימוש בתרגום האופציונלי או בטקסט ברירת מחדל */}
      {students.length === 0 && (
        <p>{t.noChildren || "אין נתוני ילדים להצגה."}</p>
      )}

      {/* מעבר על כל תלמיד במערך ויצירת כרטיס עבורו */}
      {students.map((child) => (
        // שימוש ב-ID של הילד כמפתח ייחודי לכל כרטיס - חשוב לריאקט
        // הערה: נשאר עם bg-secondary לפי הקוד שלך, שנה ל-bg-teal-50 אם רצית את העיצוב הקודם
        <Card key={child._id} className="bg-secondary mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {/* הצגת שם מלא של הילד */}
              <span>{child.firstName} {child.lastName}</span>
              {/* הצגת הכיתה - ודא ש'class' הוא השדה הנכון */}
              {/* מומלץ להוסיף בדיקה אם השדה קיים + תווית מתורגמת */}
              {child.class && ( // או child.classId? בדוק את הטיפוס Student
                 <span className="text-sm">{t.classLabel || "כיתה"} {child.class}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* כפתור יצירת קשר */}
            <Button
              variant="outline"
              className="w-full"
              // הפעלת הפונקציה onContactTeacher עם הפרמטרים הנכונים בלחיצה
              onClick={() => {
                  // ודא שגם teacherId וגם _id קיימים לפני הקריאה
                  if (child.teacherId && child._id) {
                      onContactTeacher(child.teacherId, child._id, `${child.firstName} ${child.lastName}`);
                  } else {
                      // אם אחד מהם חסר, הדפס אזהרה ולא קרא לפונקציה
                      console.warn(`Cannot contact teacher: Missing teacherId (${child.teacherId}) or studentId (${child._id}) for ${child.firstName} ${child.lastName}`);
                  }
              }}
              // השבתת הכפתור אם teacherId או _id (studentId) חסרים
              disabled={!child.teacherId || !child._id}
            >
              {/* אייקון של הודעה */}
              <MessageCircle className="w-4 h-4 mr-2" />
              {/* טקסט הכפתור מהתרגום */}
              {t.contactTeacher}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};