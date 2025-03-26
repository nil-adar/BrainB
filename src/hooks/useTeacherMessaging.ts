
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export const useTeacherMessaging = (teacherId: string, refreshUnreadMessages: () => Promise<void>) => {
  const [isMessageSheetOpen, setIsMessageSheetOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>();
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();

  const openMessageSheet = (parentId: string) => {
    setSelectedParentId(parentId);
    setIsMessageSheetOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedParentId) {
      return;
    }
    
    try {
      await axios.post('/api/messages', {
        senderId: teacherId,
        receiverId: selectedParentId,
        content: messageText,
        senderRole: 'teacher',
        isRead: false
      });
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      
      setMessageText("");
      // Refresh messages to update the UI
      refreshUnreadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return {
    isMessageSheetOpen,
    setIsMessageSheetOpen,
    selectedParentId,
    openMessageSheet,
    messageText,
    setMessageText,
    handleSendMessage
  };
};
