
import { Parent } from "@/types/school";

export const mockParents: Parent[] = [
  {
    id: "1",
    uniqueId: "567891234",
    name: "דוד כהן",
    email: "david@example.com",
    phone: "050-5678912",
    role: "parent",
    password: "hashedPassword111",
    childrenIds: ["1"],
    questionnaires: []
  },
  {
    id: "2",
    uniqueId: "678912345",
    name: "רחל כהן",
    email: "rachel@example.com",
    phone: "050-6789123",
    role: "parent",
    password: "hashedPassword222",
    childrenIds: ["1"],
    questionnaires: []
  },
  {
    id: "3",
    uniqueId: "789123456",
    name: "משה לוי",
    email: "moshe@example.com",
    phone: "050-7891234",
    role: "parent",
    password: "hashedPassword333",
    childrenIds: ["2"],
    questionnaires: []
  },
  {
    id: "4",
    uniqueId: "891234567",
    name: "שרה לוי",
    email: "sarah@example.com",
    phone: "050-8912345",
    role: "parent",
    password: "hashedPassword444",
    childrenIds: ["2"],
    questionnaires: []
  },
  {
    id: "5",
    uniqueId: "912345678",
    name: "יעקב פרץ",
    email: "yaakov@example.com",
    phone: "050-9123456",
    role: "parent",
    password: "hashedPassword555",
    childrenIds: ["3"],
    questionnaires: []
  },
  {
    id: "6",
    uniqueId: "123789456",
    name: "לאה פרץ",
    email: "leah@example.com",
    phone: "050-1237894",
    role: "parent",
    password: "hashedPassword666",
    childrenIds: ["3"],
    questionnaires: []
  }
];
