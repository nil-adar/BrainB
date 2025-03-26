
import { Bell, BarChart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Student, Message } from "@/types/school";
import { useState, useEffect } from "react";
import { MessageSheet } from "@/components/teacher/MessageSheet";
import axios from "axios";
import { toast } from "sonner";

interface StudentCardProps {
  student: Student;
  onViewProgress?: (studentId: string) => void;
  onContactParent?: (parentId: string) => void;
  teacherId?: string;
}

const actionTranslations = {
  en: [
    { text: "Create pre-Assessment", path: "/create-assessment" },
    { text: "View Pre-Assessments", path: "/statistics" },
    { text: "Daily Task Update", path: "/daily-tasks" },
    { text: "View recommendations", path: (id: string) => `/student/${id}` },
  ],
  he: [
    { text: "צור הערכה מקדימה", path: "/create-assessment" },
    { text: "צפה בהערכות", path: "/statistics" },
    { text: "עדכון משימות יומי", path: "/daily-tasks" },
    { text: "צפה בהמלצות", path: (id: string) => `/student/${id}` },
  ]
};

export const StudentCard = ({ 
  student, 
  onViewProgress, 
  onContactParent,
  teacherId = "teacher1" // Default teacher ID, should be replaced with actual logged-in teacher ID
}: StudentCardProps) => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const actions = actionTranslations[language];
  const [messageSheetOpen, setMessageSheetOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const getPath = (path: string | ((id: string) => string)) => {
    return typeof path === "function" ? path(student.id) : path;
  };

  const handleViewProgress = () => {
    if (onViewProgress) {
      onViewProgress(student.id);
    } else {
      navigate("/statistics");
    }
  };

  const handleContactParent = () => {
    if (student.parentIds.length > 0) {
      setSelectedParentId(student.parentIds[0]);
      setMessageSheetOpen(true);
      fetchMessages(student.parentIds[0]);
    }
  };

  const fetchMessages = async (parentId: string) => {
    try {
      const response = await axios.get(`/api/messages/conversation/${teacherId}/${parentId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedParentId) return;
    
    try {
      await axios.post('/api/messages', {
        senderId: teacherId,
        receiverId: selectedParentId,
        content: messageText,
        senderRole: 'teacher',
        isRead: false
      });
      
      if (onContactParent) {
        onContactParent(selectedParentId);
      }
      
      toast.success("Message sent successfully");
      setMessageText("");
      setMessageSheetOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const buttonLabels = {
    en: {
      viewProgress: "View progress",
      contactParent: "Contact parent"
    },
    he: {
      viewProgress: "צפה בהתקדמות",
      contactParent: "צור קשר עם הורה"
    }
  };

  const messageLabels = {
    en: {
      messageToParent: "Message to parent",
      writeMessage: "Write your message here...",
      sendMessage: "Send message"
    },
    he: {
      messageToParent: "הודעה להורה",
      writeMessage: "כתוב את ההודעה שלך כאן...",
      sendMessage: "שלח הודעה"
    }
  };

  const t = buttonLabels[language];
  const mt = messageLabels[language];

  return (
    <Card className="bg-secondary p-3 md:p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
          onClick={() => navigate(`/student/${student.id}`)}
        >
          <img
            src={student.avatar}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <h3 className="font-semibold text-base md:text-lg">
            {`${student.firstName} ${student.lastName}`}
          </h3>
        </div>
        <Bell className="text-gray-400 hover:text-accent cursor-pointer w-5 h-5" />
      </div>
      <div className="mt-3 md:mt-4 space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(getPath(action.path))}
            className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base"
          >
            {action.text}
          </button>
        ))}
        
        <button
          onClick={handleViewProgress}
          className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-between"
        >
          <BarChart className="w-4 h-4" />
          <span>{t.viewProgress}</span>
        </button>

        {student.parentIds.length > 0 && (
          <button
            onClick={handleContactParent}
            className="w-full text-right px-2 md:px-3 py-1.5 md:py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-between"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.contactParent}</span>
          </button>
        )}
      </div>

      <MessageSheet
        isOpen={messageSheetOpen}
        onOpenChange={setMessageSheetOpen}
        selectedStudentName={`${student.firstName} ${student.lastName}`}
        selectedParentId={selectedParentId}
        senderId={teacherId}
        senderRole="teacher"
        receiverId={selectedParentId}
        messages={messages}
        messageText={messageText}
        onMessageChange={setMessageText}
        onSendMessage={handleSendMessage}
        translations={mt}
      />
    </Card>
  );
};
