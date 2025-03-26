
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, MessageCircle } from "lucide-react";
import { Student } from "@/types/school";

interface StudentCardProps {
  student: Student;
  translations: {
    viewProgress: string;
    contactParent: string;
  };
  onViewProgress: (studentId: string) => void;
  onContactParent: (parentId: string) => void;
}

export const StudentCard = ({
  student,
  translations: t,
  onViewProgress,
  onContactParent,
}: StudentCardProps) => {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{student.firstName} {student.lastName}</span>
          <span className="text-sm">כיתה {student.class}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => onViewProgress(student.id)}
          >
            <BarChart className="w-4 h-4 mr-2" />
            {t.viewProgress}
          </Button>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onContactParent(student.parentIds[0])}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t.contactParent}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
