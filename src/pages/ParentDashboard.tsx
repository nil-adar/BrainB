import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Users, FileText, BarChart, Globe, BellDot, Send, Calendar as CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Parent, Student, Teacher, Message } from "@/types/school";
import { mockStudents } from "@/services/mock/students";
import { mockTeachers } from "@/services/mock/teachers";
import { mockMessages } from "@/services/mock/messages";
import { mockSchoolEvents, SchoolEvent } from "@/services/mock/schoolEvents";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const translations = {
  en: {
    title: "Parent Dashboard",
    childProgress: "Children Progress",
    questionnaire: "Parent Questionnaire",
    messages: "Messages",
    viewProgress: "View Progress",
    fillQuestionnaire: "Fill Questionnaire",
    contactTeacher: "Contact Teacher",
    search: "Search",
    messageToTeacher: "Message to Teacher",
    send: "Send",
    close: "Close",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    markAsRead: "Mark as read",
    teacherMessage: "Message from teacher",
    sendMessage: "Send Message",
    writeMessage: "Write your message here...",
    messageSent: "Message sent successfully",
    viewConversation: "View Conversation",
  },
  he: {
    title: "לוח הבקרה להורים",
    childProgress: "התקדמות הילדים",
    questionnaire: "שאלון הורים",
    messages: "הודעות",
    viewProgress: "צפה בהתקדמות",
    fillQuestionnaire: "מלא שאלון",
    contactTeacher: "צור קשר עם המורה",
    search: "חיפוש",
    messageToTeacher: "הודעה למורה",
    send: "שלח",
    close: "סגור",
    notifications: "התראות",
    noNotifications: "אין התראות חדשות",
    markAsRead: "סמן כנקרא",
    teacherMessage: "הודעה מהמורה",
    sendMessage: "שלח הודעה",
    writeMessage: "כתוב את ההודעה שלך כאן...",
    messageSent: "ההודעה נשלחה בהצלחה",
    viewConversation: "צפה בשיחה",
  }
};

const initialNotifications = [
  {
    id: 1,
    teacherId: "t1",
    message: "שיעורי הבית הוגשו בהצלחה",
    timestamp: "2024-02-20T10:00:00",
    read: false
  },
  {
    id: 2,
    teacherId: "t2",
    message: "נא להגיע לפגישת הורים ביום שלישי",
    timestamp: "2024-02-19T15:30:00",
    read: false
  }
];

interface ParentDashboardProps {
  parent?: Parent;
}

const ParentDashboard = ({ parent }: ParentDashboardProps) => {
  const [language, setLanguage] = useState<"en" | "he">("he");
  const [messageText, setMessageText] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState(initialNotifications.map(n => ({
    ...n,
    isChecked: false,
    color: ""
  })));
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();
  const t = translations[language];

  const parentId = "1";
  const childrenData = mockStudents.filter(student => 
    student.parentIds.includes(parentId)
  );

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "he" : "en");
    document.documentElement.dir = language === "en" ? "rtl" : "ltr";
  };

  const getTeacherForStudent = (studentClass: string) => {
    return mockTeachers.find(teacher => teacher.assignedClass === studentClass);
  };

  const handleSendMessage = (teacherId: string) => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: parentId,
      receiverId: teacherId,
      content: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderRole: "parent"
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
    toast({
      description: t.messageSent,
    });
  };

  const getTeacherMessages = (teacherId: string) => {
    return messages.filter(
      msg => (msg.senderId === teacherId && msg.receiverId === parentId) ||
             (msg.senderId === parentId && msg.receiverId === teacherId)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const handleNotificationCheckboxChange = (notificationId: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isChecked: !notification.isChecked }
          : notification
      )
    );
  };

  const handleColorSelection = (notificationId: number, color: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, color, read: true }
          : notification
      ).filter(notification => 
        !notification.read || !notification.color
      )
    );
  };

  const handleNotificationClick = (teacherId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTeacherId(teacherId);
    setIsMessageSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsMessageSheetOpen(open);
    if (!open) {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => 
          !notification.read || !notification.color
        )
      );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentEvents = mockSchoolEvents.filter(event => 
    !event.studentId || childrenData.some(child => child.id === event.studentId)
  );

  const getEventsForDate = (date: Date) => {
    return studentEvents.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const modifiers = {
    exam: studentEvents
      .filter(event => event.type === 'exam')
      .map(event => event.date),
    holiday: studentEvents
      .filter(event => event.type === 'holiday')
      .map(event => event.date),
    meeting: studentEvents
      .filter(event => event.type === 'meeting')
      .map(event => event.date),
    report: studentEvents
      .filter(event => event.type === 'report')
      .map(event => event.date),
    general: studentEvents
      .filter(event => event.type === 'general')
      .map(event => event.date),
  };

  const modifiersStyles = {
    exam: { backgroundColor: 'rgb(254 226 226)' }, // bg-red-100
    holiday: { backgroundColor: 'rgb(220 252 231)' }, // bg-green-100
    meeting: { backgroundColor: 'rgb(219 234 254)' }, // bg-blue-100
    report: { backgroundColor: 'rgb(243 232 255)' }, // bg-purple-100
    general: { backgroundColor: 'rgb(254 249 195)' }, // bg-yellow-100
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo size="md" />
              <div className="relative">
                <Input
                  type="search"
                  placeholder={t.search}
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <BellDot className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    <DropdownMenuGroup>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`p-4 ${notification.color ? `bg-${notification.color}-100` : notification.read ? 'bg-gray-50' : 'bg-white'}`}
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{t.teacherMessage}</span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleNotificationClick(notification.teacherId, e)}
                                  >
                                    {t.viewConversation}
                                  </Button>
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={notification.isChecked}
                                      onCheckedChange={() => handleNotificationCheckboxChange(notification.id)}
                                    />
                                    {notification.isChecked && (
                                      <div className="flex gap-1">
                                        {['purple', 'green', 'blue', 'yellow'].map((color) => (
                                          <button
                                            key={color}
                                            className={`w-4 h-4 rounded-full bg-${color}-400 hover:bg-${color}-500`}
                                            onClick={() => handleColorSelection(notification.id, color)}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(notification.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          <span className="text-muted-foreground">{t.noNotifications}</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <Globe className="w-5 h-5" />
                <span>{language === "en" ? "עברית" : "English"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={isMessageSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="w-[400px]">
          <SheetHeader>
            <SheetTitle>
              {t.messageToTeacher} - {
                mockTeachers.find(t => t.id === selectedTeacherId)?.name
              }
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col h-full">
            <ScrollArea className="flex-1 h-[400px] pr-4">
              <div className="space-y-4">
                {selectedTeacherId && getTeacherMessages(selectedTeacherId).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.senderRole === "parent"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto pt-4">
              <div className="flex gap-2">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={t.writeMessage}
                  className="min-h-[100px]"
                />
              </div>
              <SheetFooter className="mt-4">
                <Button
                  onClick={() => selectedTeacherId && handleSendMessage(selectedTeacherId)}
                  disabled={!messageText.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t.sendMessage}
                </Button>
              </SheetFooter>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            שלום, {parent?.name || 'הורה יקר'}
          </h1>
          <p className="text-muted-foreground mt-2">
            ברוכים הבאים ללוח הבקרה שלכם
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">{t.childProgress}</h2>
              {childrenData.map((child) => {
                const teacher = getTeacherForStudent(child.class);
                return (
                  <Card key={child.id} className="bg-secondary">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{child.firstName} {child.lastName}</span>
                        <span className="text-sm">כיתה {child.class}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button 
                          variant="default" 
                          className="w-full"
                          onClick={() => navigate(`/student/${child.id}`)}
                        >
                          <BarChart className="w-4 h-4 mr-2" />
                          {t.viewProgress}
                        </Button>

                        {teacher && (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSelectedTeacherId(teacher.id);
                              setIsMessageSheetOpen(true);
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {t.contactTeacher}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.questionnaire}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  {t.fillQuestionnaire}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.messages}</CardTitle>
              </CardHeader>
              <CardContent>
                {childrenData.map((child) => {
                  const teacher = getTeacherForStudent(child.class);
                  return teacher ? (
                    <Button
                      key={child.id}
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => {
                        setSelectedTeacherId(teacher.id);
                        setIsMessageSheetOpen(true);
                      }}
                    >
                      {t.messageToTeacher} - {teacher.name}
                    </Button>
                  ) : null;
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  לוח שנה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={he}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
                
                {selectedDate && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      אירועים ל-{format(selectedDate, 'dd/MM/yyyy')}:
                    </h4>
                    <div className="space-y-2">
                      {getEventsForDate(selectedDate).map((event) => (
                        <HoverCard key={event.id}>
                          <HoverCardTrigger asChild>
                            <div className={`p-2 rounded-md cursor-pointer
                              ${event.type === 'exam' ? 'bg-red-100' : ''}
                              ${event.type === 'holiday' ? 'bg-green-100' : ''}
                              ${event.type === 'meeting' ? 'bg-blue-100' : ''}
                              ${event.type === 'report' ? 'bg-purple-100' : ''}
                              ${event.type === 'general' ? 'bg-yellow-100' : ''}
                            `}>
                              <p className="text-sm font-medium">{event.title}</p>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <p className="text-sm font-medium">{event.title}</p>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">
                                  {event.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {format(event.date, 'EEEE, d MMMM yyyy', { locale: he })}
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">מקרא:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-100"></div>
                      <span>מבחנים</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-100"></div>
                      <span>חגים</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                      <span>פגישות</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                      <span>תעודות</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                      <span>כללי</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
