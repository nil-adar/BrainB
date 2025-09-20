import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Message } from "@/types/school";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/components/SettingsContext";

export interface MessageSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentName: string;
  senderId: string;
  studentId: string;
  senderRole: "teacher" | "parent";
  receiverId: string;
  messages: Message[];
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  translations: {
    messageToParent?: string;
    messageToTeacher?: string;
    writeMessage: string;
    sendMessage: string;
  };
}

export const MessageSheet = ({
  isOpen,
  onOpenChange,
  selectedStudentName,
  senderId,
  senderRole,
  studentId,
  receiverId,
  translations: t,
}: MessageSheetProps) => {
  const { language } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/messages/conversation/${senderId}/${receiverId}/${studentId}`;

      const response = await axios.get(url);
      const messageArray = Array.isArray(response.data) ? response.data : [];
      setMessages(messageArray);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [senderId, receiverId, studentId, toast]);

  useEffect(() => {
    if (isOpen && senderId && receiverId && studentId) {
      fetchMessages();
    }
  }, [isOpen, senderId, receiverId, studentId, fetchMessages]); // הוסף fetchMessages

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const newMessage = {
        id: crypto.randomUUID(),
        senderId,
        receiverId,
        studentId,
        content: messageText,
        senderRole,
        isRead: false,
        timestamp: new Date().toISOString(),
      };
      // הוסף log לפני השליחה:
      console.log("🔍 Debug message info:");
      console.log("senderId:", senderId);
      console.log("receiverId:", receiverId);
      console.log("studentId:", studentId);
      console.log("Sending message payload:", newMessage);

      await axios.post("/api/messages", newMessage);
      setMessageText("");
      fetchMessages();
      toast({ title: "Success", description: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [messages]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {t.messageToParent} - {selectedStudentName}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-[calc(100vh-200px)] p-4">
          {" "}
          <ScrollArea className="flex-1 px-4 py-2">
            {loading ? (
              <div className="flex justify-center p-8 text-gray-500 text-base">
                {language === "he" ? "טוען הודעות..." : "Loading messages..."}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center p-8 text-gray-500 text-base">
                {language === "he" ? "אין הודעות עדיין" : "No messages yet"}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg max-w-[85%] shadow-sm ${
                      msg.senderRole === senderRole
                        ? "ml-auto bg-teal-600 text-white"
                        : "mr-auto bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-base  leading-relaxed">{msg.content}</p>
                    <span className="text-sm  opacity-70 mt-2 block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          <div className="flex-shrink-0 p-4 pb-6 border-t bg-white">
            <div className="space-y-3"></div>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={t.writeMessage}
              className="min-h-[100px] resize-none border-2 focus:border-teal-600"
            />
            <SheetFooter className="mt-4">
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="w-full bg-teal-600 hover:bg-teal-600 text-white font-medium py-3 shadow-md"
              >
                <Send className="w-4 h-4 mr-2" />
                {t.sendMessage}
              </Button>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
