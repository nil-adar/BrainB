
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Message } from "@/types/school";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface MessageSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentName: string;
  selectedParentId?: string;
  senderId: string;
  senderRole: 'teacher' | 'parent';
  receiverId?: string;
  messages: Message[];
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  translations: {
    messageToParent: string;
    writeMessage: string;
    sendMessage: string;
  };
}

export const MessageSheet = ({
  isOpen,
  onOpenChange,
  selectedStudentName,
  selectedParentId,
  senderId,
  senderRole,
  receiverId,
  messages: initialMessages,
  messageText,
  onMessageChange,
  onSendMessage,
  translations: t,
}: MessageSheetProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch messages if we have both sender and receiver IDs
    if (isOpen && senderId && receiverId) {
      fetchMessages();
    }
  }, [isOpen, senderId, receiverId]);

  const fetchMessages = async () => {
    if (!senderId || !receiverId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/messages/conversation/${senderId}/${receiverId}`);
      // Ensure we have an array of messages
      const messageArray = Array.isArray(response.data) ? response.data : [];
      setMessages(messageArray);
      
      // Mark all received messages as read
      if (senderRole === 'teacher') {
        const unreadMessages = messageArray.filter(
          (msg: Message) => msg.receiverId === senderId && !msg.isRead
        );
        
        for (const msg of unreadMessages) {
          if (msg.id) {
            await axios.patch(`/api/messages/${msg.id}/read`, {});
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !senderId || !receiverId) return;
    
    try {
      const newMessage = {
        senderId,
        receiverId,
        content: messageText,
        senderRole,
        isRead: false,
      };
      
      await axios.post('/api/messages', newMessage);
      
      // Optimistically update UI
      setMessages(prev => [...prev, {
        ...newMessage,
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }]);
      
      // Call parent handler
      onSendMessage();
      
      // Refresh messages
      fetchMessages();

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
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
                {Array.isArray(messages) && messages.map((msg) => (
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
            <div className="flex gap-2">
              <Textarea
                value={messageText}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder={t.writeMessage}
                className="min-h-[100px]"
              />
            </div>
            <SheetFooter className="mt-4">
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || !receiverId}
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
