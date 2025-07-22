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
import axios from "axios";
import { useTeacherNotifications } from "@/hooks/useTeacherNotifications";
import { useSettings } from "@/components/SettingsContext";

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
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

  // the shape of what `/users/:teacherId` returns
interface TeacherData {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

  // reuse the same shape for classes everywhere
  type ClassOption = {
    schoolId: string;
    schoolName: string;
    classId: string;
    className: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const { language } = useSettings();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const {
    notifications,
    unreadMessages, // אם תרצה להשתמש בעתיד
    handleNotificationClick,
    handleNotificationCheckboxChange,
    handleNotificationColorSelection,
  } = useTeacherNotifications(teacherId ?? "");

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedStudentId) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: teacherId!,
      receiverId: selectedParentId!,
      studentId: selectedStudentId, // ← נוסף
      content: messageText,
      senderRole: "teacher",
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("/api/messages", newMessage); // ← שליחה לשרת
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    } catch (error) {
      console.error("❌ שגיאה בשליחת הודעה:", error);
    }
  };

  const [assignedClasses, setAssignedClasses] = useState<
    {
      schoolId: string;
      schoolName: string;
      classId: string;
      className: string;
    }[]
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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const openMessageSheet = (
    studentId: string,
    parentId: string,
    studentName: string
  ) => {
    console.log(
      "✅ פתיחת צ'אט: studentId =",
      studentId,
      ", parentId =",
      parentId
    );
    console.log("📥 פתיחת צ'אט:");
    console.log("👦 studentId:", studentId);
    console.log("👨‍👩‍👧 parentId:", parentId);
    console.log("👧 שם תלמיד:", studentName);
    setSelectedParentId(parentId);
    setSelectedStudentName(studentName);
    setSelectedStudentId(studentId);

    setIsMessageSheetOpen(true);
  };

  useEffect(() => {
    const id = getUserIdFromToken();
    setTeacherId(id);
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    teacherService
      .getAssignedClasses(teacherId)
      .then((classes) => {
        console.log("📥 קיבלתי מהשרת כיתות:", classes);
        setAssignedClasses(classes);
      })
      .catch((error) => {
        console.error("❌ שגיאה בשליפת כיתות:", error);
      });
  }, [teacherId]);

  const t = dashboardTranslations[language];

  useEffect(() => {
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (!teacherId || teacherData) return;
    dataService
      .getData<TeacherData>(`/users/${teacherId}`)
      .then((response) => {
        if (response.success) setTeacherData(response.data);
      })
      .catch(console.error);
  }, [teacherId, teacherData]);

  const { data: teacherProfile } = useQuery({
    queryKey: ["teacherProfile", teacherId],
    queryFn: () => userProfileService.getUserProfile(teacherId!),
    enabled: !!teacherId,
  });

  useEffect(() => {
    if (teacherData?._id) {
      localStorage.setItem("teacherId", teacherData._id);
    }

    if (currentClass?.classId) {
      localStorage.setItem("classId", currentClass.classId);
    }
  }, [teacherData, currentClass]);

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

    const normalize = (val: string) =>
      (val ?? "")
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
      str
        .split("")
        .map((char) => char.charCodeAt(0))
        .join(",");

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

  const handleOpenNotification = (
    parentId: string,
    studentId: string,
    studentName: string
  ) => {
    handleNotificationClick(parentId, studentId); // מסמן כהודעה נקראה
    openMessageSheet(studentId, parentId, studentName); // פותח שיחה
  };

  const teacherName = teacherData
    ? `${teacherData.firstName || ""} ${teacherData.lastName || ""}`.trim()
    : "מורה";

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
        notifications={notifications}
        onNotificationClick={(parentId, studentId, studentName) =>
          handleOpenNotification(parentId, studentId, studentName)
        }
        onNotificationCheckboxChange={handleNotificationCheckboxChange}
        onNotificationColorSelection={handleNotificationColorSelection}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        translations={{
          search: t.search,
          notifications: t.notifications,
          noNotifications: t.noNotifications,
          viewConversation: t.viewConversation,
          viewAssessment: t.viewAssessment,
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
{isMessageSheetOpen && (
  <MessageSheet
    isOpen={isMessageSheetOpen}
    onOpenChange={setIsMessageSheetOpen}
    selectedStudentName={selectedStudentName}
    senderId={teacherId!}
    studentId={selectedStudentId!}
    senderRole="teacher"
    receiverId={selectedParentId!}
    messages={messages}
    messageText={messageText}
    onMessageChange={setMessageText}
    onSendMessage={handleSendMessage}
    translations={{
      messageToParent: t.messageToParent,
      writeMessage: t.writeMessage,
      sendMessage: t.sendMessage,
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
              digitalClock: t.digitalClock,
            }}
            language={language}
          />
        )}
        <div className="flex items-center justify-between mb-4 mt-10">
          <h2 className="text-xl font-semibold">{t.classStudents}</h2>
          <Button
            className={`rounded-xl shadow px-3 py-2 text-sm ${
              language === "he" ? "ml-6" : "mr-6"
            }`}
            onClick={() => setIsAddStudentOpen(true)}
          >
            {language === "he" ? "הוסף תלמיד חדש  ➕" : "Add New Student  ➕"}
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
            contactMessage: t.contactMessage,
          }}
          onViewProgress={handleViewProgress}
    onContactParent={(student) => {
 const parentId = student?.parentIds?.[0] ?? "";
  const fullName = student.firstName && student.lastName
    ? `${student.firstName} ${student.lastName}`
    : student.name ?? "תלמיד";

    const studentId = student._id || student.id;

  console.log("🎯 פתיחת שיחה:", {
    studentId,
    parentId,
    fullName,
  });

  if (parentId && studentId) {
    openMessageSheet(studentId, parentId, fullName);
  } else {
    console.warn("❌ אין מזהה הורה או תלמיד תקין:", { student });
  }

}}

          teacherId={teacherId}
          questionnaireRole="teacher"
        />

        <AddStudentModal
          open={isAddStudentOpen}
          onOpenChange={setIsAddStudentOpen}
          currentClass={currentClass}
          teacherId={teacherId!}
          classes={assignedClasses.map((cls) => cls.classId)}
        />
      </div>
    </div>
  );
}
{
  /* שאלונים זמינים למילוי על ידי המורה */
}
{
  /*<section className="mt-8">
  <h3 className="text-lg font-semibold mb-2">שאלונים זמינים</h3>
  {filteredStudents?.map((student) => {
    const id = student.id || (student as any)._id;
    const name = `${student.firstName} ${student.lastName}`;
    return (
      <div
        key={id}
        className="mb-2 flex items-center justify-between p-3 border rounded-lg hover:shadow"
      >
        <span className="font-medium">{name}</span>
        <Link
          to={`/questionnaire/teacher/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          למילוי שאלון
        </Link>
      </div>
    );
  })}

  {/* שאלונים זמינים למילוי על ידי המורה */
}
{
  /*</section>
<section className="mt-8">
  <h3 className="text-lg font-semibold mb-2">שאלונים זמינים</h3>
  {filteredStudents?.map((student) => {
    const id = student.id || (student as any)._id;
    const name = `${student.firstName} ${student.lastName}`;
    return (
      <div
        key={id}
        className="mb-2 flex items-center justify-between p-3 border rounded-lg hover:shadow"
      >
        <span className="font-medium">{name}</span>
        <Link
          to={`/questionnaire/teacher/${id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          למילוי שאלון
        </Link>
      </div>
    );
  })}
</section>
*/
}
