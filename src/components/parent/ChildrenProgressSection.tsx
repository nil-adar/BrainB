import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Student } from "@/types/school";
import { useNavigate } from "react-router-dom";

// הגדרת ה-Props שהקומפוננטה מקבלת
interface ChildrenProgressSectionProps {
  students: Student[];
  // מקבלת: ID של המורה, שם מלא של התלמיד, ID של התלמיד
  onContactTeacher: (
    teacherId: string,
    studentName: string,
    studentId: string
  ) => void;
  // אובייקט עם מחרוזות התרגום הנדרשות
  translations: {
    childProgress: string;
    contactTeacher: string;
    noChildren: string;
    classLabel: string;
    fillStudentForm: string;
    fillQuestionnaireFor: string;
    viewRecommendationsFor: string;
    noChildrenData: string;
    class: string;
  };
}

export const ChildrenProgressSection = ({
  students,
  onContactTeacher,
  translations: t,
}: ChildrenProgressSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">{t.childProgress}</h2>

      {/* הצגת הודעה אם אין תלמידים */}
      {students.length === 0 && (
        <p>{t.noChildren || t.noChildrenData || "אין נתוני ילדים להצגה."}</p>
      )}

      {/* מעבר על כל תלמיד במערך ויצירת כרטיס עבורו */}
      {students.map((child) => (
        <Card key={child._id} className="bg-secondary mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              {/* הצגת שם מלא של הילד */}
              <span>
                {child.firstName} {child.lastName}
              </span>
              {/* הצגת הכיתה */}
              {child.class && (
                <span className="text-sm">
                  {t.classLabel || t.class || "כיתה"} {child.class}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-2">
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              onClick={() =>
                child.teacherId
                  ? onContactTeacher(
                      child.teacherId,
                      `${child.firstName} ${child.lastName}`,
                      child.id
                    )
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
              className="w-full text-emerald-700 hover:underline hover:bg-emerald-200"
              onClick={() => navigate(`/questionnaire/parent/${child.id}`)}
            >
              📋 {t.fillQuestionnaireFor || "Fill questionnaire for"}{" "}
              {child.firstName} {child.lastName}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-emerald-700 hover:underline hover:bg-emerald-200"
              onClick={() =>
                (window.location.href = `http://localhost:8080/recommendations?studentId=${child.id}`)
              }
            >
              {t.viewRecommendationsFor || "View recommendations for"}{" "}
              {child.firstName} {child.lastName}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
