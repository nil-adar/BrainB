import { useState, useEffect } from "react";
import { Notification, Message } from "@/types/school";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export const useTeacherNotifications = (teacherId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // 🛡️ אם אין teacherId – אל תנסה למשוך הודעות
    if (!teacherId) {
      setNotifications([]);
      setUnreadMessages([]);
      return;
    }
  
    const fetchUnreadMessages = async () => {
      try {
        console.log("Fetching unread messages for teacher:", teacherId);
        const { data } = await axios.get<Message[]>(
          `/api/messages/unread/${teacherId}`
        );
  
        setUnreadMessages(data);
  
        // הפיכת ההודעות להתראות
        const messageNotifications: Notification[] = data.map(msg => ({
          id: msg._id ?? msg.id ?? `${msg.senderId}_${msg.timestamp}`,
          parentId: msg.senderId,
          studentId: msg.studentId, // ✅ נוסף
          studentName: msg.studentName ?? "הודעה מהורה",
          message: "התקבלה הודעה חדשה מההורה",
          timestamp: msg.timestamp,
          read: false,
          type: "message",
          isChecked: false,
          color: ""
        }));
        
  
        // מתמזג עם התראות קיימות
        setNotifications(prev =>
          [...prev.filter(n => n.type !== "message"), ...messageNotifications]
        );
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    };
  
    fetchUnreadMessages();               // קריאה ראשונה
    const interval = setInterval(fetchUnreadMessages, 30_000); // כל 30 ש׳
    return () => clearInterval(interval); // ניקוי טיימר
  }, [teacherId]);
  

  const handleNotificationClick = (parentId: string, studentId?: string) => {
    const markAsRead = async () => {
      try {
        const toMark = unreadMessages.filter(
          (m) =>
            String(m.senderId) === parentId &&
            (!studentId || String(m.studentId) === studentId)
        );
  
        await Promise.all(
          toMark.map((m) =>
            axios.patch(`/api/messages/${m._id}/read`, {})
          )
        );
  
        setUnreadMessages((prev) =>
          prev.filter(
            (m) =>
              !(String(m.senderId) === parentId &&
                (!studentId || String(m.studentId) === studentId))
          )
        );
  
        setNotifications((prev) =>
          prev.filter(
            (n) =>
              !(n.type === "message" &&
                n.parentId === parentId &&
                (!studentId || n.studentId === studentId))
          )
        );
      } catch (err) {
        console.error("Error marking messages as read:", err);
        toast({
          title: "שגיאה",
          description: "לא הצלחנו לסמן כהודעות נקראות",
          variant: "destructive",
        });
      }
    };
  
    markAsRead();
  };
  

  const handleNotificationCheckboxChange = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isChecked: !n.isChecked } : n
      )
    );
  };
  
  const handleNotificationColorSelection = (
    notificationId: string,
    color: string
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, color, read: true } : n
      )
    );
  };
  

  const refreshUnreadMessages = async () => {
    if (!teacherId) return;
    try {
      const { data } = await axios.get<Message[]>(
        `/api/messages/unread/${teacherId}`
      );
      setUnreadMessages(data);
    } catch (err) {
      console.error("Error refreshing unread messages:", err);
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
