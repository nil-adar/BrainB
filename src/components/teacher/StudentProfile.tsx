import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "@/types/school";

interface StudentProfileProps {
  student: Student;
}

export const StudentProfile = ({ student }: StudentProfileProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage
          src={student.avatar || "/placeholder.svg"}
          alt={student.firstName}
        />
        <AvatarFallback>
          {student?.firstName?.[0] ?? "?"}
          {student?.lastName?.[0] ?? ""}
        </AvatarFallback>
      </Avatar>

      <div>
        <h3 className="font-bold">
          {student.firstName} {student.lastName}
        </h3>
      </div>
    </div>
  );
};
