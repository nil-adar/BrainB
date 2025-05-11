import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Message } from "@/types/school";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && senderId && receiverId && studentId) {
      fetchMessages();
    }
  }, [isOpen, senderId, receiverId, studentId]);
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/messages/conversation/${senderId}/${receiverId}/${studentId}`
      );
      const messageArray = Array.isArray(response.data) ? response.data : [];
      setMessages(messageArray);
  
      // סימון קריאה, אם צריך...
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({ title: "Error", description: "Failed to fetch messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  

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
        timestamp: new Date().toISOString() // גם חשוב לטיפוס שלך
      };
      console.log("Sending message payload:", newMessage);

      await axios.post('/api/messages', newMessage);
      setMessageText("");
      fetchMessages();
      toast({ title: "Success", description: "Message sent successfully" });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {t.messageToParent} - {selectedStudentName}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col h-full">
          <ScrollArea className="flex-1 h-[400px] pr-4">
            {loading ? (
              <div className="flex justify-center p-4">Loading messages...</div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.senderRole === senderRole
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
            )}
          </ScrollArea>
          <div className="mt-auto pt-4">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={t.writeMessage}
              className="min-h-[100px]"
            />
            <SheetFooter className="mt-4">
              <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
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
