import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/services/teacherService";
import { dataService } from "@/services/dataService";
import { AddStudentModal } from "@/components/teacher/AddStudentModal";
import { dashboardTranslations } from "@/utils/dashboardTranslations";
import { TeacherHeader } from "@/components/teacher/TeacherHeader";
import { TeacherGreeting } from "@/components/teacher/TeacherGreeting";
import { TeacherSchedule } from "@/components/teacher/TeacherSchedule";
import { StudentsList } from "@/components/teacher/StudentsList";
import { ClassSwitcher } from "@/components/teacher/ClassSwitcher";
import { MessageSheet } from "@/components/teacher/MessageSheet";
import { userProfileService } from "@/services/userProfileService";
import { useNavigate } from "react-router-dom";
import { Message } from "@/types/school";
import { Button } from "@/components/ui/button";



function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.id;
  } catch {
    return null;
  }
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const handleViewProgress = (studentId: string) => {
    navigate(`/statistics?studentId=${studentId}`);
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [language, setLanguage] = useState<"en" | "he">("he");
  const [teacherData, setTeacherData] = useState<any>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(), // 👈 חובה כדי להתאים לטיפוס Message
      senderId: teacherId!,
      receiverId: selectedParentId!,
      content: messageText,
      senderRole: "teacher",
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };
  

  const [assignedClasses, setAssignedClasses] = useState<
    { schoolId: string; schoolName: string; classId: string; className: string;  }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClass, setCurrentClass] = useState<{
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
  } | null>(null);
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);


  const openMessageSheet = (
    studentId: string,
    parentId: string,
    studentName: string
  ) => {
    setSelectedParentId(parentId);
    setSelectedStudentName(studentName);
    setIsMessageSheetOpen(true);
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;
  
    teacherService.getAssignedClasses(teacherId)
      .then(classes => {
        console.log("📥 קיבלתי מהשרת כיתות:", classes);
        setAssignedClasses(classes);
      })
      .catch(error => {
        console.error("❌ שגיאה בשליפת כיתות:", error);
      });
  }, [teacherId]);
  
  const t = dashboardTranslations[language];

  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!teacherId || teacherData) return;
    dataService.getData<any>(`/users/${teacherId}`)
      .then(response => {
        if (response.success) setTeacherData(response.data);
      })
      .catch(console.error);
  }, [teacherId]);

  const { data: teacherProfile } = useQuery({
    queryKey: ["teacherProfile", teacherId],
    queryFn: () => userProfileService.getUserProfile(teacherId!),
    enabled: !!teacherId,
  });
  console.log("👨‍🏫 teacherProfile:", teacherProfile);
  useEffect(() => {
    if (teacherProfile?.assignedClasses?.length) {
      const active =
        teacherProfile.assignedClasses.find((cls: any) => cls.isActive) ||
        teacherProfile.assignedClasses[0];
      setCurrentClass(active);
    }
  }, [teacherProfile]);

  const {
    data: allStudents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allStudents", teacherId],
    queryFn: () => teacherService.getTeacherStudents(teacherId!),
    enabled: !!teacherId,
  });

  console.log("🟢 currentClass:", currentClass);
  console.log("🟢 allStudents:", allStudents);

  const filteredStudents = allStudents?.filter((s, index) => {
    console.log(`🔍 תלמיד ${index + 1} מפתחות:`, Object.keys(s));
  
    const normalize = (val: any) =>
      String(val ?? "")
        .normalize("NFKC") // Normalize composed characters
        .replace(/\s+/g, "") // Remove all whitespace
        .replace(/[\u200E\u200F\uFEFF]/g, ""); // Remove directional and invisible marks
  
    const studentClassId = normalize(s.classId);
    const currentClassId = normalize(currentClass?.classId);
  
    const matchesClass =
      currentClassId && studentClassId
        ? studentClassId === currentClassId
        : true;
  
    const matchesTeacher = s.teacherId === teacherId;
  
    const unicodeBreakdown = (str: string) =>
      str.split("").map((char) => char.charCodeAt(0)).join(",");
  
    console.log(`👩‍🏫 תלמיד ${index + 1}:`);
    console.log("🆔 student.classId (raw):", s.classId);
    console.log("🎯 currentClass.classId (raw):", currentClass?.classId);
    console.log("🧼 studentClassId (norm):", studentClassId);
    console.log("🧼 currentClassId (norm):", currentClassId);
    console.log("🔢 יוניקוד תלמיד:", unicodeBreakdown(studentClassId));
    console.log("🔢 יוניקוד כיתה נבחרת:", unicodeBreakdown(currentClassId));
    console.log("🎓 התאמת כיתה:", matchesClass);
    console.log("📚 teacherId תלמיד:", s.teacherId);
    console.log("👨‍🏫 teacherId נוכחי:", teacherId);
    console.log("✅ התאמה מורה:", matchesTeacher);
    console.log("🔎 סטטוס סינון:", matchesClass && matchesTeacher);
    console.log("────────────");
  
    return matchesClass && matchesTeacher;
  });
  
  
  

  

  const toggleLanguage = () => setLanguage(prev => (prev === "en" ? "he" : "en"));
  const teacherName = teacherData?.name || "שרה";
  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleClassChange = (classData: any) => setCurrentClass(classData);

  const classSwitcherComponent = teacherId ? (
<ClassSwitcher
  teacherId={teacherId}
  classOptions={teacherProfile?.assignedClasses || []}
  language={language}
  onClassChange={handleClassChange}
/>


  ) : null;
  

  const greetingClassText = currentClass
  ? language === "he"
    ? `כיתה ${currentClass.className}, ${currentClass.schoolName}`
    : `Class ${currentClass.className}, ${currentClass.schoolName}`
  : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TeacherHeader
        language={language}
        toggleLanguage={toggleLanguage}
        notifications={[]}
        onNotificationClick={() => {}}
        onNotificationCheckboxChange={() => {}}
        onNotificationColorSelection={() => {}}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        translations={{
          search: t.search,
          notifications: t.notifications,
          noNotifications: t.noNotifications,
          viewConversation: t.viewConversation,
          viewAssessment: t.viewAssessment
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-6">
          <TeacherGreeting
            teacherName={teacherName}
            translations={{ greeting: t.greeting, grade: t.grade }}
            assignedClass={greetingClassText}
            classSwitcher={classSwitcherComponent}
          />
        </div>

        {selectedParentId && (
          <MessageSheet
            isOpen={isMessageSheetOpen}
            onOpenChange={setIsMessageSheetOpen}
            selectedStudentName={selectedStudentName}
            senderId={teacherId!}
            senderRole="teacher"
            receiverId={selectedParentId}
            translations={{
              messageToParent: t.messageToParent,
              writeMessage: t.writeMessage,
              sendMessage: t.sendMessage
            }}
          />
        )}

        {teacherId && (
          <TeacherSchedule
            teacherId={teacherId}
            translations={{
              schedule: t.schedule,
              time: t.time,
              subject: t.subject,
              topic: t.topic,
              room: t.room,
              digitalClock: t.digitalClock
            }}
            language={language}
          />
        )}
        <div className="flex items-center justify-between mb-4 mt-10">
          <h2 className="text-xl font-semibold">{t.classStudents}</h2>
           <Button
                className="rounded-xl shadow px-3 py-2 text-sm"
            onClick={() => setIsAddStudentOpen(true)}
               >
             ➕ הוסף תלמיד חדש
          </Button>
        </div>
        <StudentsList
          students={filteredStudents || []}
          isLoading={isLoading}
          error={error as Error}
          searchTerm={searchTerm}
          translations={{
            loading: t.loading,
            error: t.error,
            classStudents: t.classStudents,
            mood: t.mood,
            contactParent: t.contactParent,
            viewProgress: t.viewProgress,
            createAssessment: t.createAssessment,
            viewPreAssessments: t.viewPreAssessments,
            dailyTaskUpdate: t.dailyTaskUpdate,
            viewRecommendations: t.viewRecommendations,
            progressMessage: t.progressMessage,
            contactMessage: t.contactMessage
          }}
          onViewProgress={handleViewProgress}
          onContactParent={(student) =>
            openMessageSheet(
              student.id,
              student.parentIds[0],
              `${student.firstName} ${student.lastName}`
            )
          }
          />

          <AddStudentModal
            open={isAddStudentOpen}
            onOpenChange={setIsAddStudentOpen}
            currentClass={currentClass}
            teacherId={teacherId!}
            classes={assignedClasses.map(cls => cls.classId)} 
          />

      </div>
    </div>
  );
}
