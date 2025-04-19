import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { MessageSheet } from "@/components/teacher/MessageSheet";
import { mockStudents } from "@/services/mock/students";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { FileText, BarChart, MessageCircle, Calendar as CalendarIcon, Globe, BellDot } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const translations = {
  en: {
    childProgress: "Children Progress",
    questionnaire: "Parent Questionnaire",
    messages: "Messages",
    viewProgress: "View Progress",
    fillQuestionnaire: "Fill Questionnaire",
    contactTeacher: "Contact Teacher",
    search: "Search",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    messageToTeacher: "Message to Teacher",
    writeMessage: "Write your message here...",
    sendMessage: "Send Message"
  },
  he: {
    childProgress: "התקדמות הילדים",
    questionnaire: "שאלון הורים",
    messages: "הודעות",
    viewProgress: "צפה בהתקדמות",
    fillQuestionnaire: "מלא שאלון",
    contactTeacher: "צור קשר עם המורה",
    search: "חיפוש",
    notifications: "התראות",
    noNotifications: "אין התראות חדשות",
    messageToTeacher: "הודעה למורה",
    writeMessage: "כתוב את ההודעה שלך כאן...",
    sendMessage: "שלח הודעה"
  }
};

const initialNotifications = [
  { id: 1, teacherId: "t1", message: "שיעורי הבית הוגשו בהצלחה", timestamp: "2024-02-20T10:00:00", read: false },
  { id: 2, teacherId: "t2", message: "נא להגיע לפגישת הורים ביום שלישי", timestamp: "2024-02-19T15:30:00", read: false },
];

export default function ParentDashboard({ parent }: { parent?: { id: string; name: string } }) {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(initialNotifications.map(n => ({ ...n, isChecked: false, color: "" })));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const t = translations[language];
  const parentId = parent?.id || "1";

  useEffect(() => {
    const children = mockStudents.filter(s => s.parentIds.includes(parentId));
    setStudents(children);
  }, [parentId]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "en" ? "he" : "en"));
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
  };

  const openMessageSheet = (teacherId: string, studentName: string) => {
    setSelectedTeacherId(teacherId);
    setSelectedStudentName(studentName);
    setIsMessageSheetOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    const newMessage = {
      senderId: parentId,
      receiverId: selectedTeacherId,
      content: messageText,
      senderRole: "parent",
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-primary">שלום, {parent?.name || 'הורה יקר'}</h1>

        {selectedTeacherId && (
          <MessageSheet
            isOpen={isMessageSheetOpen}
            onOpenChange={setIsMessageSheetOpen}
            selectedStudentName={selectedStudentName}
            senderId={parentId}
            senderRole="parent"
            receiverId={selectedTeacherId!}
            messages={messages}
            messageText={messageText}
            onMessageChange={setMessageText}
            onSendMessage={handleSendMessage}
            translations={{
              messageToParent: t.messageToTeacher,
              writeMessage: t.writeMessage,
              sendMessage: t.sendMessage
            }}
          />
        )}

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">{t.childProgress}</h2>
          {students.map(child => (
            <Card key={child.id} className="bg-secondary mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{child.firstName} {child.lastName}</span>
                  <span className="text-sm">כיתה {child.class}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openMessageSheet(child.teacherId, `${child.firstName} ${child.lastName}`)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.contactTeacher}
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
