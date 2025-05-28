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

import { Message, Student } from "@/types/school";
import { format } from "date-fns";
import { he, enUS } from "date-fns/locale";
import { CalendarIcon, MessageCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ChildrenProgressSection } from "@/components/parent/ChildrenProgressSection";






const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: parentService.getLoggedInUser,
  });
};



  
  const translations = {
    en: {
      childProgress:    "Children Progress",
      contactTeacher:   "Contact Teacher",
      search:           "Search",
      settings:         "Settings",
      notifications:    "Notifications",
      noNotifications:  "No new notifications",
      fillStudentForm: "Student Form",
      
      messageToTeacher: "Message to Teacher",
      writeMessage:     "Write your message here...",
      sendMessage:      "Send Message",
      calendar:         "Calendar",
      upcomingEvents:   "Upcoming Events",
      loadingParent:    "Loading parent data...",
      errorParent:      "Error loading parent data",
      welcome:          "Welcome back",
      logout:           "Logout",             
      profile:          "Profile",             
      viewConversation: "View Conversation", 
      viewAssessment:   "View Assessment",     
    },
    he: {
      childProgress:    "התקדמות הילד",
      contactTeacher:   "צור קשר עם המורה",
      notifications:    "התראות",
      settings:         "הגדרות",
      fillStudentForm: "שאלון תלמיד  ",

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
      logout:           "התנתק",              
      profile:          "פרופיל",            
      viewConversation: "פתח שיחה",         
      viewAssessment:   "צפה בהערכה",         
    }
  } as const

  

  export default function ParentDashboard({
    parent,
  }: {
    parent?: { id: string; name: string; firstName?: string; lastName?: string };
  }) {
    const [language, setLanguage] = useState<"en" | "he">("he");
    const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [selectedStudentName, setSelectedStudentName] = useState<string>("");
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const navigate = useNavigate();
  


   
    
    const t = translations[language];
    
 
    const { data: loggedInUser, isLoading, error } = useQuery({
      queryKey: ["user"],
      queryFn: parentService.getLoggedInUser,
    });
    
    const parentId = loggedInUser?._id || parent?.id;
    const {
      notifications,
      markAsRead,
      setNotifications
    } = useParentNotifications(parentId || "");
    

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

    const openMessageSheet = (
      teacherId: string,
      studentName: string,
      studentId: string      //   
    ) => {
      setSelectedTeacherId(teacherId);
      setSelectedStudentName(studentName);
      setSelectedStudentId(studentId);  // 
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
        const response = await axios.get(`/api/messages/conversation/${parentId}/${selectedTeacherId}`);
        const messageArray = Array.isArray(response.data) ? response.data : [];
        setMessages(messageArray);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    const handleOpenNotification = (teacherId: string, studentId: string, studentName: string) => {
      markAsRead(teacherId, studentId); // סימון ההודעה כנקראה
      openMessageSheet(teacherId, studentName, studentId); // פתיחת הצ'אט
      setNotifications((prev) =>
         prev.filter((n) => !(n.teacherId === teacherId && n.studentId === studentId))
      );
    };
    return (
      <div className="min-h-screen bg-white">
        <ParentHeader 
          language={language} 
          toggleLanguage={toggleLanguage}
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
            search: t.search,
            settings: t.settings || "הגדרות",
            logout: t.logout || "התנתק",
            profile: "פרופיל",
            noNotifications: t.noNotifications,
            viewConversation: t.viewConversation,
            viewAssessment: t.viewAssessment,
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
       
    
          </div> {/* Closing Flex Div */}
    
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
             fillStudentForm: t.fillStudentForm,
              // Add missing keys if needed by the component, e.g.:
              // noChildren: t.noChildren,
              // classLabel: t.classLabel,
            }}
          />
          <section className="mt-4">
  <h3 className="text-lg font-semibold mb-2">שאלונים זמינים</h3>
  {students.map((child) => (
    <div key={child.id || child._id} className="mb-2">
   
    </div>
  ))}
</section>

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
    dir={language === "he" ? "rtl" : "ltr"}
  />

  <div className="mt-6 bg-blue-50 rounded-xl p-4">
    <h3 className="font-semibold mb-2">{t.upcomingEvents}</h3>
    {[
      { date: new Date(2025, 4, 20), title: "יום הורים" },
      { date: new Date(2025, 4, 25), title: "מפגש הורים ומורים" },
      { date: new Date(2025, 5, 30), title: "יום לימודים אחרון לשנת הלימודים" },
    ].map((event, index) => (
      <div
        key={index}
        className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2"
      >
        <div className="font-bold text-yellow-700">{event.title}</div>
        <div className="text-sm text-gray-600">
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
