/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getLocalizedDate } from "@/utils/dateTranslations";
import { format } from "date-fns";
import { useMemo } from "react";

/**
 * TeacherDashboard.tsx
 *
 * Main dashboard interface for teachers.
 *
 * 🔍 Responsibilities:
 * - Displays teacher's students, schedule, class switching, and notifications
 * - Supports search and filter of students by class and name
 * - Allows messaging between teacher and parents via MessageSheet
 * - Enables progress viewing, assessment initiation, and student management
 * - Fetches and displays user data, assigned classes, and student list
 *
 * ⚙️ Features:
 * - Class filtering with Unicode normalization
 * - Notifications with read/check/color support
 * - Add new student modal per selected class
 * - Multi-language support (Hebrew/English) with RTL handling
 *
 * 📦 UI: ShadCN components, custom hooks (e.g., useTeacherNotifications), react-query for async data
 */

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
    unreadMessages,
    handleNotificationClick,
    handleNotificationCheckboxChange,
    handleNotificationColorSelection,
  } = useTeacherNotifications(teacherId ?? "");

  const currentDate = useMemo(
    () => getLocalizedDate(format(new Date(), "EEEE, MMM do, yyyy"), language),
    [language]
  );
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedStudentId) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: teacherId!,
      receiverId: selectedParentId!,
      studentId: selectedStudentId,
      content: messageText,
      senderRole: "teacher",
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("/api/messages", newMessage);
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

  const filteredStudents = currentClass
    ? allStudents?.filter((s, index) => {
        const normalize = (val: string) =>
          (val ?? "")
            .normalize("NFKC")
            .replace(/\s+/g, "")
            .replace(/[\u200E\u200F\uFEFF]/g, "");

        // ✅ נעדיף classId אם קיים, אחרת נ fallback ל-class
        const studentClassId = normalize(s.classId || s.class);
        const currentClassId = normalize(currentClass.classId);

        const matchesClass = studentClassId === currentClassId;
        const matchesTeacher = s.teacherId === teacherId;

        console.log(`👩‍🏫 תלמיד ${index + 1}:`);
        console.log("🆔 student.classId:", s.classId);
        console.log("🆔 student.class:", s.class);
        console.log("🎯 currentClass.classId:", currentClass.classId);
        console.log("🎓 התאמת כיתה:", matchesClass);
        console.log("✅ התאמת מורה:", matchesTeacher);

        return matchesClass && matchesTeacher;
      })
    : [];

  const handleOpenNotification = (
    parentId: string,
    studentId: string,
    studentName: string
  ) => {
    handleNotificationClick(parentId, studentId);
    openMessageSheet(studentId, parentId, studentName);
  };

  const teacherName = teacherData
    ? `${teacherData.firstName || ""} ${teacherData.lastName || ""}`.trim()
    : "מורה";

  const handleSearchChange = (value: string) => setSearchTerm(value);
  const handleClassChange = (classData: any) => {
    console.log("🟡 currentClass אחרי בחירה (onClassChange):", classData);
    setCurrentClass(classData);
  };

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
        currentDate={currentDate}
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
            language={language}
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
            className={`rounded-xl shadow px-3 py-2 text-sm text-gray-200 bg-emerald-200 hover:opacity-80 text-zinc-800 ${
              language === "he" ? "ml-6" : "mr-6"
            }`}
            onClick={() => setIsAddStudentOpen(true)}
          >
            {language === "he" ? "הוסף תלמיד חדש  ➕" : "Add New Student  ➕"}
          </Button>
        </div>
        <StudentsList
          students={filteredStudents || []}
          language={language}
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
            const fullName =
              student.firstName && student.lastName
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
