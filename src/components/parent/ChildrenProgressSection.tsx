
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Student } from "@/types/school";

interface ChildrenProgressSectionProps {
  students: Student[];
  onContactTeacher: (teacherId: string, studentName: string) => void;
  translations: {
    childProgress: string;
    contactTeacher: string;
  };
}

export const ChildrenProgressSection = ({
  students,
  onContactTeacher,
  translations: t,
}: ChildrenProgressSectionProps) => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">{t.childProgress}</h2>
      {students.map(child => (
        <Card key={child._id} className="bg-secondary mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{child.firstName} {child.lastName}</span>
              <span className="text-sm">כיתה {child.class}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onContactTeacher(child.teacherId, `${child.firstName} ${child.lastName}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {t.contactTeacher}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
