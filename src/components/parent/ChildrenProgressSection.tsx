import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Student } from "@/types/school"; // ודא שהטיפוס Student מיובא ונכון

// הגדרת ה-Props שהקומפוננטה מקבלת
interface ChildrenProgressSectionProps {
  students: Student[]; 
  // מקבלת: ID של המורה, ID של התלמיד, שם מלא של התלמיד
  onContactTeacher: (teacherId: string, studentId: string, studentName: string) => void;
  // אובייקט עם מחרוזות התרגום הנדרשות
  translations: {
    childProgress: string; 
    contactTeacher: string; 
    noChildren?: string; // אופ
    classLabel?: string; // אופ
     fillStudentForm?: string; 
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
          <CardContent className="p-4 pt-2 space-y-2">
  <Button
    variant="outline"
    className="w-full border-primary text-primary hover:bg-primary/10"
    onClick={() =>
      child.teacherId
        ? onContactTeacher(child.teacherId, `${child.firstName} ${child.lastName}`, child.id)
        : console.warn(`Teacher ID missing for student ${child.id}`)
    }
    disabled={!child.teacherId}
  >
    <MessageCircle className="w-4 h-4 ml-2" />
    {t.contactTeacher}
  </Button>

  {/* כפתור שאלון */}
  <Button
    variant="secondary"
    className="w-full text-indigo-700 hover:underline hover:bg-indigo-50"
      onClick={() => window.location.href = `/parent/${child.id}/form`}
  >
    📋 עבור אל שאלון של {child.firstName} {child.lastName}
  </Button>
  <Button
  variant="ghost"
  className="w-full text-emerald-700 hover:underline hover:bg-emerald-50"
  onClick={() => window.location.href = `http://localhost:8080/recommendations?studentId=${child.id}`}
>
   צפייה בהמלצות של {child.firstName} {child.lastName}
</Button>

</CardContent>

        </Card>
      ))}
    </section>
  );
};