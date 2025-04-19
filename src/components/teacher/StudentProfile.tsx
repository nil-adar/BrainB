import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "@/types/school";

interface StudentProfileProps {
  student: Student;
  moodLabel: string;
}

export const StudentProfile = ({ student, moodLabel }: StudentProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.firstName} />
        <AvatarFallback>
          {(student?.firstName?.[0] ?? "?")}{student?.lastName?.[0] ?? ""}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <h3 className="font-bold">{student.firstName} {student.lastName}</h3>
        <p className="text-sm text-muted-foreground">{moodLabel}: לא דווח</p>
      </div>
    </div>
  );
};
