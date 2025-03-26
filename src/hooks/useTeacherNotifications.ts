
import { useState, useEffect } from "react";
import { Notification, Message } from "@/types/school";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const initialNotifications: Notification[] = [
  {
    id: 1,
    parentId: "p1",
    studentName: "דוד כהן",
    message: "התקבלה הודעה חדשה מההורה",
    timestamp: "2024-02-20T10:00:00",
    read: false,
    type: "message"
  },
  {
    id: 2,
    parentId: "p2",
    studentName: "רות לוי",
    message: "הודעה חדשה מההורה",
    timestamp: "2024-02-19T15:30:00",
    read: false,
    type: "message"
  },
  {
    id: 3,
    parentId: "p3",
    studentName: "מיה כהן",
    message: "האבחון ההתנהגותי הושלם",
    timestamp: "2024-02-20T09:15:00",
    read: false,
    type: "assessment",
    assessmentType: "behavioral"
  },
  {
    id: 4,
    parentId: "p4",
    studentName: "יובל לוי",
    message: "האבחון הקוגניטיבי הושלם",
    timestamp: "2024-02-20T11:30:00",
    read: false,
    type: "assessment",
    assessmentType: "cognitive"
  },
  {
    id: 5,
    parentId: "p5",
    studentName: "נועה פרץ",
    message: "התקבלה הודעה חדשה מההורה",
    timestamp: "2024-02-20T12:45:00",
    read: false,
    type: "message"
  }
];

export const useTeacherNotifications = (teacherId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch unread messages for the teacher
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/unread/${teacherId}`);
        const messageData = Array.isArray(response.data) ? response.data : [];
        setUnreadMessages(messageData);
        
        // Convert unread messages to notifications
        const messageNotifications = messageData.map((message: Message, index: number) => ({
          id: typeof message.id === 'string' ? parseInt(message.id.replace(/\D/g, '')) || index + 100 : index + 100,
          parentId: message.senderId,
          studentName: "הודעה מהורה", // This should be replaced with actual student name if available
          message: "התקבלה הודעה חדשה מההורה",
          timestamp: message.timestamp,
          read: false,
          type: "message",
          isChecked: false,
          color: ""
        }));
        
        // Merge with existing notifications (except message ones which we're replacing)
        const nonMessageNotifications = notifications.filter(n => n.type !== "message");
        setNotifications([...nonMessageNotifications, ...messageNotifications]);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };
    
    fetchUnreadMessages();
    
    // Set up interval to check for new messages every 30 seconds
    const interval = setInterval(fetchUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [teacherId]);

  const handleNotificationClick = (parentId: string) => {
    console.log("Clicked notification for parent:", parentId);
    
    // Mark related messages as read
    const markMessagesAsRead = async () => {
      try {
        // Find the messages from this parent
        const messagesToMark = unreadMessages.filter(m => m.senderId === parentId);
        
        // Mark each as read
        for (const message of messagesToMark) {
          if (message.id) {
            await axios.patch(`/api/messages/${message.id}/read`, {});
          }
        }
        
        // Update local state
        setUnreadMessages(prev => prev.filter(m => m.senderId !== parentId));
        
        // Remove from notifications
        setNotifications(prev => prev.filter(n => !(n.type === "message" && n.parentId === parentId)));
        
      } catch (error) {
        console.error('Error marking messages as read:', error);
        toast({
          title: "Error",
          description: "Failed to mark messages as read",
          variant: "destructive"
        });
      }
    };
    
    markMessagesAsRead();
    
    return parentId;
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

  const handleNotificationColorSelection = (notificationId: number, color: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, color, read: true }
          : notification
      )
    );
  };

  const refreshUnreadMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/unread/${teacherId}`);
      const messageData = Array.isArray(response.data) ? response.data : [];
      setUnreadMessages(messageData);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  return {
    notifications,
    unreadMessages,
    handleNotificationClick,
    handleNotificationCheckboxChange,
    handleNotificationColorSelection,
    refreshUnreadMessages
  };
};
