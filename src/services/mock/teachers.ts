
import { Teacher } from "@/types/school";

export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    uniqueId: "123456789",
    name: "שירה ישראלי",
    email: "shira@school.com",
    phone: "050-1234567",
    role: "teacher",
    password: "hashedPassword777",
    teacherId: "T123",
    assignedClass: "ד"
  },
  {
    id: "t2",
    uniqueId: "987654321",
    name: "יוסי כהן",
    email: "yossi@school.com",
    phone: "050-7654321",
    role: "teacher",
    password: "hashedPassword888",
    teacherId: "T124",
    assignedClass: "ה"
  }
];
