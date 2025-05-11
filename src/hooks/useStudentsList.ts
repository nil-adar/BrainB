
import { useState } from "react";
import { Student } from "@/types/school";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useStudentsList = (
  students: Student[] | undefined,
  isLoading: boolean,
  error: Error | null,
  translations: {
    progressMessage: string;
    contactMessage: string;
  }
) => {
  const navigate = useNavigate();
  
  // Fallback students for development/demo purposes
  const [fallbackStudents] = useState([
    
    {
      id: "fallback1",
      uniqueId: "234567891",
      userId: "mia2015",
      name: "מיה כהן",
      firstName: "מיה",
      lastName: "כהן",
      email: "mia@student.school.com",
      phone: "050-2345678",
      role: "student" as const,
      password: "hashedPassword123",
      class: "ד",
      grade: "1",
      dateOfBirth: "2015-05-15",
      parentIds: ["1", "2"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=1",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback2",
      uniqueId: "345678912",
      userId: "yuval2015",
      name: "יובל לוי",
      firstName: "יובל",
      lastName: "לוי",
      email: "yuval@student.school.com",
      phone: "050-3456789",
      role: "student" as const,
      password: "hashedPassword456",
      class: "ד",
      grade: "2",
      dateOfBirth: "2015-03-20",
      parentIds: ["3", "4"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=2",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback3",
      uniqueId: "456789123",
      userId: "noa2014",
      name: "נועה פרץ",
      firstName: "נועה",
      lastName: "פרץ",
      email: "noa@student.school.com",
      phone: "050-4567891",
      role: "student" as const,
      password: "hashedPassword789",
      class: "ד",
      grade: "1",
      dateOfBirth: "2014-08-10",
      parentIds: ["5", "6"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=3",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback4",
      uniqueId: "567891234",
      userId: "neil2015",
      name: "ניל אדר",
      firstName: "ניל",
      lastName: "אדר",
      email: "neil@student.school.com",
      phone: "050-5678912",
      role: "student" as const,
      password: "hashedPassword101",
      class: "ד",
      grade: "1",
      dateOfBirth: "2015-01-25",
      parentIds: ["7", "8"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=4",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback5",
      uniqueId: "678912345",
      userId: "maya2015",
      name: "מאיה שלום",
      firstName: "מאיה",
      lastName: "שלום",
      email: "maya@student.school.com",
      phone: "050-6789123",
      role: "student" as const,
      password: "hashedPassword202",
      class: "ד",
      grade: "2",
      dateOfBirth: "2015-06-30",
      parentIds: ["9", "10"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=5",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback6",
      uniqueId: "789123456",
      userId: "itay2015",
      name: "איתי ישראלי",
      firstName: "איתי",
      lastName: "ישראלי",
      email: "itay@student.school.com",
      phone: "050-7891234",
      role: "student" as const,
      password: "hashedPassword303",
      class: "ד",
      grade: "1",
      dateOfBirth: "2015-04-12",
      parentIds: ["11", "12"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=6",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback7",
      uniqueId: "891234567",
      userId: "shira2015",
      name: "שירה דוד",
      firstName: "שירה",
      lastName: "דוד",
      email: "shira@student.school.com",
      phone: "050-8912345",
      role: "student" as const,
      password: "hashedPassword404",
      class: "ד",
      grade: "2",
      dateOfBirth: "2015-09-05",
      parentIds: ["13", "14"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=7",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback8",
      uniqueId: "912345678",
      userId: "yoav2015",
      name: "יואב כץ",
      firstName: "יואב",
      lastName: "כץ",
      email: "yoav@student.school.com",
      phone: "050-9123456",
      role: "student" as const,
      password: "hashedPassword505",
      class: "ד",
      grade: "1",
      dateOfBirth: "2015-11-15",
      parentIds: ["15", "16"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=8",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback9",
      uniqueId: "123456789",
      userId: "gal2015",
      name: "גל לביא",
      firstName: "גל",
      lastName: "לביא",
      email: "gal@student.school.com",
      phone: "050-1234567",
      role: "student" as const,
      password: "hashedPassword606",
      class: "ד",
      grade: "2",
      dateOfBirth: "2015-07-22",
      parentIds: ["17", "18"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=9",
      tasks: [],
      progressReports: []
    },
    {
      id: "fallback10",
      uniqueId: "234567890",
      userId: "dana2015",
      name: "דנה אבן",
      firstName: "דנה",
      lastName: "אבן",
      email: "dana@student.school.com",
      phone: "050-2345678",
      role: "student" as const,
      password: "hashedPassword707",
      class: "ד",
      grade: "1",
      dateOfBirth: "2015-12-05",
      parentIds: ["19", "20"],
      teacherId: "t1",
      avatar: "https://i.pravatar.cc/150?img=10",
      tasks: [],
      progressReports: []
    }
  ]);
  
  // Determine which students to display
  const displayStudents = students && students.length > 0 ? students : fallbackStudents;
  
  // Handle viewing student progress
  const handleViewProgress = (studentId: string) => {
    toast.info(`${translations.progressMessage} ${studentId}`);
    navigate(`/statistics?student=${studentId}`);
  };

  // Handle contacting a parent
  const handleContactParent = (parentId: string) => {
    const student = displayStudents?.find(s => s.parentIds.includes(parentId));
    toast.info(`${translations.contactMessage} ${student?.firstName || ''}`);
  };

  return {
    displayStudents,
    handleViewProgress,
    handleContactParent
  };
};
