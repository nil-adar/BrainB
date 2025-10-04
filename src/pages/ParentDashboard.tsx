import { useEffect, useState } from "react";
import { MessageSheet } from "@/components/teacher/MessageSheet";

import { NotificationsDropdown } from "@/components/parent/NotificationsDropdown";
import { useQuery } from "@tanstack/react-query";
import { ParentHeader } from "@/components/parent/ParentHeader";
import { User } from "@/types/school";
import { parentService } from "@/services/parentService";
import { dashboardTranslations } from "@/utils/dashboardTranslations";
import { useParentNotifications } from "@/hooks/useParentNotifications";
import { ParentNotification } from "@/hooks/useParentNotifications";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Message, Student } from "@/types/school";
import { format } from "date-fns";
import { he, enUS } from "date-fns/locale";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/components/SettingsContext";
import { ChildrenProgressSection } from "@/components/parent/ChildrenProgressSection";
import { getTimeBasedGreeting } from "@/utils/timeGreetings";
import HelpButton from "@/components/HelpButton";

/**
 * ParentDashboard.tsx
 *
 * Displays the parent dashboard interface, including:
 * - Greeting and notifications
 * - List of children and their progress
 * - Messaging interface with teachers
 * - Calendar with upcoming school events
 *
 * 🔍 Responsibilities:
 * - Fetch logged-in parent and children data
 * - Display per-student actions: progress view, questionnaires, recommendations
 * - Handle parent-teacher messaging via MessageSheet
 * - Support notifications with color tagging and read status
 *
 * 🌐 Localization: Hebrew & English (RTL/LTR support)
 * 📦 UI: ShadCN components, Lucide icons, custom hooks
 */

const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: parentService.getLoggedInUser,
  });
};

const translations = {
  en: {
    childProgress: "Children Details",
    contactTeacher: "Contact Teacher",
    //search: "Search",
    settings: "Settings",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    fillStudentForm: "Student Form",
    messageToTeacher: "Message to Teacher",
    writeMessage: "Write your message here...",
    sendMessage: "Send Message",
    calendar: "Calendar",
    upcomingEvents: "Upcoming Events",
    loadingParent: "Loading parent data...",
    errorParent: "Error loading parent data",
    //welcome: "Welcome back",
    logout: "Logout",
    profile: "Profile",
    viewConversation: "View Conversation",
    viewAssessment: "View Assessment",
    hello: "Hello",
    dearParent: "Dear Parent",
    availableQuestionnaires: "Available Questionnaires",
    parentsDay: "Parents' Day",
    parentTeacherMeeting: "Parent-Teacher Meeting",
    lastDayOfSchool: "Last Day of School Year",
    contactTeacherButton: "Contact Teacher",
    viewProgressButton: "View Progress",
    viewProgressDetails: "View Progress Details",
    studentFormFill: "Fill Student Form",
    noChildren: "No children found",
    class: "Class",
    teacher: "Teacher",
    student: "Student",
    progress: "Progress",
    assessment: "Assessment",
    form: "Form",
    available: "Available",
    questionnaire: "Questionnaire",
    questionnaires: "Questionnaires",
    classLabel: "Class",
    noChildrenData: "No children data to display",
    fillQuestionnaireFor: "Fill questionnaire for",
    viewRecommendations: "View recommendations",
    viewRecommendationsFor: "View recommendations for",
  },
  he: {
    childProgress: "פרטי הילדים ",
    contactTeacher: "צור קשר עם המורה",
    notifications: "התראות",
    settings: "הגדרות",
    fillStudentForm: "שאלון תלמיד",
    noNotifications: "אין התראות חדשות",
    messageToTeacher: "הודעה למורה",
    writeMessage: "כתוב את ההודעה שלך כאן...",
    sendMessage: "שלח הודעה",
    calendar: "לוח שנה",
    upcomingEvents: "אירועים קרובים",
    loadingParent: "טוען נתוני הורה...",
    //search: "חיפוש",
    errorParent: "שגיאה בטעינת נתוני הורה",
    // welcome: "ברוך שובך",
    logout: "התנתק",
    profile: "פרופיל",
    viewConversation: "פתח שיחה",
    viewAssessment: "צפה בהערכה",
    hello: "שלום",
    dearParent: "הורה יקר",
    availableQuestionnaires: "שאלונים זמינים",
    parentsDay: "יום הורים",
    parentTeacherMeeting: "מפגש הורים ומורים",
    lastDayOfSchool: "יום לימודים אחרון לשנת הלימודים",
    contactTeacherButton: "צור קשר עם המורה",
    viewProgressButton: "צפה בהתקדמות",
    viewProgressDetails: "צפה בפרטי התקדמות",
    studentFormFill: "מלא שאלון תלמיד",
    noChildren: "לא נמצאו ילדים",
    class: "כיתה",
    teacher: "מורה",
    student: "תלמיד",
    progress: "התקדמות",
    assessment: "הערכה",
    form: "טופס",
    available: "זמין",
    questionnaire: "שאלון",
    questionnaires: "שאלונים",
    classLabel: "כיתה",
    noChildrenData: "אין נתוני ילדים להצגה",
    fillQuestionnaireFor: "מילוי שאלון עבור",
    viewRecommendations: "צפייה בהמלצות",
    viewRecommendationsFor: "צפייה בהמלצות של",
  },
} as const;

export default function ParentDashboard({
  parent,
}: {
  parent?: { id: string; name: string; firstName?: string; lastName?: string };
}) {
  const { language } = useSettings();
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const navigate = useNavigate();

  const t = translations[language];

  const {
    data: loggedInUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: parentService.getLoggedInUser,
  });

  const parentId = loggedInUser?._id || parent?.id;
  const { notifications, markAsRead, setNotifications } =
    useParentNotifications(parentId || "");

  useEffect(() => {
    if (!parentId) return;

    const fetchChildren = async () => {
      const children = await parentService.getParentChildren(parentId);
      setStudents(children);
    };

    fetchChildren();
  }, [parentId]);

  const openMessageSheet = (
    teacherId: string,
    studentName: string,
    studentId: string
  ) => {
    setSelectedTeacherId(teacherId);
    setSelectedStudentName(studentName);
    setSelectedStudentId(studentId);
    setIsMessageSheetOpen(true);
    fetchMessages();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: parentId,
      studentId: selectedStudentId,
      receiverId: selectedTeacherId!,
      content: messageText,
      senderRole: "parent",
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const fetchMessages = async () => {
    if (!parentId || !selectedTeacherId) return;

    try {
      const response = await axios.get(
        `/api/messages/conversation/${parentId}/${selectedTeacherId}`
      );
      const messageArray = Array.isArray(response.data) ? response.data : [];
      setMessages(messageArray);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleOpenNotification = (
    teacherId: string,
    studentId: string,
    studentName: string
  ) => {
    markAsRead(teacherId, studentId);
    openMessageSheet(teacherId, studentName, studentId);
    setNotifications((prev) =>
      prev.filter(
        (n) => !(n.teacherId === teacherId && n.studentId === studentId)
      )
    );
  };

  // Events data with translation
  const upcomingEvents = [
    {
      date: new Date(2025, 8, 22),
      title: t.parentsDay,
    },
    {
      date: new Date(2025, 9, 25),
      title: t.parentTeacherMeeting,
    },
    {
      date: new Date(2025, 10, 30),
      title: t.lastDayOfSchool,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ParentHeader
        language={language}
        notifications={notifications}
        onNotificationClick={handleOpenNotification}
        onNotificationCheckboxChange={(id: string) =>
          setNotifications((n) =>
            n.map((x) => (x.id === id ? { ...x, isChecked: !x.isChecked } : x))
          )
        }
        onColorSelection={(id: string, color: string) =>
          setNotifications((n) =>
            n.map((x) => (x.id === id ? { ...x, color, read: true } : x))
          )
        }
        translations={{
          settings: t.settings,
          logout: t.logout,
          noNotifications: t.noNotifications,
          viewConversation: t.viewConversation,
          viewAssessment: t.viewAssessment,
        }}
      />
      <main className="container mx-auto p-6">
        {/* Header Section: Greeting and Notifications */}
        <div className="flex items-center justify-between mb-8">
          {isLoading ? (
            <p className="text-lg text-gray-600">{t.loadingParent}</p>
          ) : error || !loggedInUser ? (
            <p className="text-red-500 text-sm">{t.errorParent}</p>
          ) : (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-primary">
                {getTimeBasedGreeting(language)},{" "}
                {loggedInUser?.name || t.dearParent}
              </h1>
              {/*<p className="text-sm text-gray-600">{t.welcome}</p>*/}
            </div>
          )}
        </div>

        {/* Conditional Message Sheet */}
        {selectedTeacherId && (
          <MessageSheet
            isOpen={isMessageSheetOpen}
            onOpenChange={setIsMessageSheetOpen}
            selectedStudentName={selectedStudentName}
            studentId={selectedStudentId!}
            senderId={parentId}
            senderRole="parent"
            receiverId={selectedTeacherId}
            messages={messages}
            messageText={messageText}
            onMessageChange={setMessageText}
            onSendMessage={handleSendMessage}
            translations={{
              messageToTeacher: t.messageToTeacher,
              writeMessage: t.writeMessage,
              sendMessage: t.sendMessage,
            }}
          />
        )}

        {/* Children Progress Section */}
        <ChildrenProgressSection
          students={students}
          onContactTeacher={openMessageSheet}
          translations={{
            childProgress: t.childProgress,
            contactTeacher: t.contactTeacher,
            fillStudentForm: t.fillStudentForm,
            contactTeacherButton: t.contactTeacherButton,
            viewProgressButton: t.viewProgressButton,
            viewProgressDetails: t.viewProgressDetails,
            studentFormFill: t.studentFormFill,
            noChildren: t.noChildren,
            class: t.class,
            teacher: t.teacher,
            student: t.student,
            progress: t.progress,
            assessment: t.assessment,
            form: t.form,
            available: t.available,
            questionnaire: t.questionnaire,
            questionnaires: t.questionnaires,
            viewConversation: t.viewConversation,
            viewAssessment: t.viewAssessment,
            classLabel: t.classLabel,
            noChildrenData: t.noChildrenData,
            fillQuestionnaireFor: t.fillQuestionnaireFor,
            viewRecommendations: t.viewRecommendations,
            viewRecommendationsFor: t.viewRecommendationsFor,
          }}
        />

        {/* Available Questionnaires Section */}
        <section className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            {/*t.availableQuestionnaires*/}
          </h3>
          {students.map((child) => (
            <div key={child.id || child._id} className="mb-2">
              {/* Add questionnaire content here */}
            </div>
          ))}
        </section>

        {/* Calendar Section */}
        <aside className="mt-10">
          <Card className="bg-gradient-to-br from-emerald-100 to-fuchsia-50 shadow-xl mb-6 rounded-2xl border-2 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-lime-400" />
                {t.calendar}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className={language === "he" ? "rtl" : "ltr"}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={language === "he" ? he : enUS}
                  className="rounded-lg bg-white shadow"
                  key={`calendar-${language}`}
                />
              </div>

              <div className="mt-6 rounded-xl p-4">
                <h3 className="font-semibold mb-2">{t.upcomingEvents}</h3>
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="bg-black-50 border border-violet-200 rounded-md p-2 mb-2"
                  >
                    <div className="font-bold text-violet-700">
                      {event.title}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {format(event.date, "d MMMM yyyy", {
                        locale: language === "he" ? he : enUS,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

export { useLoggedInUser };
