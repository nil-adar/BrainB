import { useEffect, useState } from "react";
import { MessageSheet } from "@/components/teacher/MessageSheet";

import { NotificationsDropdown } from "@/components/parent/NotificationsDropdown";
import { useQuery } from "@tanstack/react-query";
import { ParentHeader } from "@/components/parent/ParentHeader";
import { User } from "@/types/school";
import { parentService } from "@/services/parentService";
import { dashboardTranslations } from "@/utils/dashboardTranslations";

import { Message, Student } from "@/types/school";
import { format } from "date-fns";
import { he, enUS } from "date-fns/locale";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: parentService.getLoggedInUser,
  });
};
interface ChildrenProgressSectionProps {
  students: Student[];
  onContactTeacher: (teacherId: string, studentName: string) => void;
  translations: {
    childProgress: string;
    contactTeacher: string;
  };
}

  interface Props {
    students: Student[];
    onContactTeacher: (teacherId: string, studentName: string) => void;
    translations: {
      childProgress: string;
      contactTeacher: string;
    };
  }
  export const ChildrenProgressSection = ({
    students,
    onContactTeacher,
    translations: t,
  }: ChildrenProgressSectionProps) => {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">{t.childProgress}</h2>
        {students.length === 0 && <p>אין נתוני ילדים להצגה.</p>}
        {students.map((child) => (
          <Card key={child._id} className="bg-teal-50 mb-4 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="flex justify-between items-center text-base">
                <span>{child.firstName} {child.lastName}</span>
                <span className="text-sm text-gray-600">כיתה {child.classId}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() =>
                  child.teacherId
                    ? onContactTeacher(child.teacherId, `${child.firstName} ${child.lastName}`)
                    : console.warn(`Teacher ID missing for student ${child.id}`)
                }
                disabled={!child.teacherId}
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                {t.contactTeacher}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  };
  
  const translations = {
    en: {
      childProgress:    "Children Progress",
      contactTeacher:   "Contact Teacher",
      search:           "Search",
      settings:         "Settings",
      notifications:    "Notifications",
      noNotifications:  "No new notifications",
      messageToTeacher: "Message to Teacher",
      writeMessage:     "Write your message here...",
      sendMessage:      "Send Message",
      calendar:         "Calendar",
      upcomingEvents:   "Upcoming Events",
      loadingParent:    "Loading parent data...",
      errorParent:      "Error loading parent data",
      welcome:          "Welcome back",
    },
    he: {
      childProgress:    "התקדמות הילד",
      contactTeacher:   "צור קשר עם המורה",
      notifications:    "התראות",
      settings:         "הגדרות",
      noNotifications:  "אין התראות חדשות",
      messageToTeacher: "הודעה למורה",
      writeMessage:     "כתוב את ההודעה שלך כאן...",
      sendMessage:      "שלח הודעה",
      calendar:         "לוח שנה",
      upcomingEvents:   "אירועים קרובים",
      loadingParent:    "טוען נתוני הורה...",
      search:           "חיפוש",
      errorParent:      "שגיאה בטעינת נתוני הורה",
      welcome:          "ברוך שובך",
    }
  } as const

  const initialNotifications = [
    {
      id: 1,
      teacherId: "t1",
      message: "שיעורי הבית הוגשו בהצלחה",
      timestamp: "2024-02-20T10:00:00",
      read: false,
      isChecked: false,
      color: "",
    },
    {
      id: 2,
      teacherId: "t2",
      message: "נא להגיע לפגישת הורים ביום שלישי",
      timestamp: "2024-02-19T15:30:00",
      read: false,
      isChecked: false,
      color: "",
    },
  ];

  export default function ParentDashboard({
    parent,
  }: {
    parent?: { id: string; name: string; firstName?: string; lastName?: string };
  }) {
    const [language, setLanguage] = useState<"en" | "he">("he");
    const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [selectedStudentName, setSelectedStudentName] = useState<string>("");
    const [messageText, setMessageText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [notifications, setNotifications] = useState(initialNotifications);
   
    
    const t = translations[language];
    
 
    const { data: loggedInUser, isLoading, error } = useQuery({
      queryKey: ["user"],
      queryFn: parentService.getLoggedInUser,
    });
    
    const parentId = loggedInUser?._id || parent?.id;
    
    

    useEffect(() => {
      if (!parentId) return;
    
      const fetchChildren = async () => {
        const children = await parentService.getParentChildren(parentId);
        setStudents(children);
      };
    
      fetchChildren();
    }, [parentId]);
    const toggleLanguage = () => {
      setLanguage((prev) => (prev === "en" ? "he" : "en"));
      document.documentElement.dir = language === "en" ? "rtl" : "ltr";
    };

    const openMessageSheet = (teacherId: string, studentName: string) => {
      setSelectedTeacherId(teacherId);
      setSelectedStudentName(studentName);
      setIsMessageSheetOpen(true);
    };

    const handleSendMessage = async () => {
      if (!messageText.trim()) return;
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: parentId,
        receiverId: selectedTeacherId!,
        content: messageText,
        senderRole: "parent",
        isRead: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    };

    return (
      <div className="min-h-screen bg-white">
        <ParentHeader 
          language={language} 
          toggleLanguage={toggleLanguage}
          translations={{
            search: t.search,
            settings: t.settings || "הגדרות",
            logout: "התנתק",
            profile: "פרופיל",
          }}
        />
        <main className="container mx-auto p-6">
          {/* Header Section: Greeting and Notifications */}
          <div className="flex items-center justify-between mb-8"> {/* Opening Flex Div */}
    
            {/* Greeting Logic */}
            {isLoading ? (
              // Case 1: Loading
              <p className="text-lg text-gray-600">{t.loadingParent}</p>
            ) : error || !loggedInUser ? (
              // Case 2: Error or No User Data after loading
              <p className="text-red-500 text-sm">{t.errorParent}</p>
            ) : (
              // Case 3: Success - No error and user data exists
              <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-primary">
                  {/* Use optional chaining just in case name is missing, although the condition checks for loggedInUser */}
                  שלום, {loggedInUser?.name || "הורה יקר"} 👋
                </h1>
                {/* Welcome message inside the success case */}
                <p className="text-sm text-gray-600">{t.welcome}</p>
              </div>
            )}
            {/* End of Greeting Logic */}
    
            {/* Notifications Dropdown - Should be inside the flex container */}
            <NotificationsDropdown
              notifications={notifications}
              onNotificationCheckboxChange={(id) =>
                setNotifications((n) =>
                  n.map((x) => (x.id === id ? { ...x, isChecked: !x.isChecked } : x))
                )
              }
              onColorSelection={(id, color) =>
                setNotifications((n) =>
                  n.map((x) => (x.id === id ? { ...x, color, read: true } : x))
                )
              }
              translations={{ notifications: t.notifications, noNotifications: t.noNotifications }}
            />
    
          </div> {/* Closing Flex Div */}
    
          {/* Conditional Message Sheet */}
          {selectedTeacherId && (
            <MessageSheet
              isOpen={isMessageSheetOpen}
              onOpenChange={setIsMessageSheetOpen}
              selectedStudentName={selectedStudentName}
              senderId={parentId}
              senderRole="parent"
              receiverId={selectedTeacherId}
              messages={messages} // Pass actual messages for the selected teacher
              messageText={messageText}
              onMessageChange={setMessageText}
              onSendMessage={handleSendMessage}
              translations={{
                messageToTeacher: t.messageToTeacher, // Corrected key based on usage
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
              // Add missing keys if needed by the component, e.g.:
              // noChildren: t.noChildren,
              // classLabel: t.classLabel,
            }}
          />
    
          {/* Calendar Section */}
          <aside className="mt-10">
            <Card className="bg-gradient-to-br from-indigo-100 via-blue-50 to-teal-50 shadow-xl mb-6 rounded-2xl border-2 border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-indigo-400" />
                  {t.calendar}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={language === "he" ? he : enUS}
                  className="rounded-lg bg-white shadow"
                  dir={language === "he" ? "rtl" : "ltr"} // Added direction based on language
                />
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    );
  }
  export { useLoggedInUser };
