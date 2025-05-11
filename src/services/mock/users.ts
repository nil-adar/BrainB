
import { User } from "@/types/school";

export const mockUsers: User[] = [
  {
    id: "t1",
    uniqueId: "123456789",
    name: "שירה ישראלי",
    email: "shira@school.com",
    phone: "050-1234567",
    role: "teacher",
    password: "123456"
  },
  {
    id: "p1",
    uniqueId: "567891234",
    name: "דוד כהן",
    email: "david@example.com",
    phone: "050-5678912",
    role: "parent",
    password: "123456"
  },
  {
    id: "s1",
    uniqueId: "234567891",
    name: "מיה כהן",
    email: "mia@student.school.com",
    phone: "050-2345678",
    role: "student",
    password: "123456"
  },
  {
    id: "a1",
    uniqueId: "987654321",
    name: "רחל מנהלת",
    email: "admin@school.com",
    phone: "050-9876543",
    role: "admin",
    password: "123456"
  }
];
