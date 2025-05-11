// אין צורך לייבא Notification אם אתה לא משתמש בו ישירות:
import { useState, useEffect } from "react";
import { Message } from "@/types/school";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// ייצוא ישיר של הממשק – זה מספיק ואין לכתוב export נוסף עבורו
export interface ParentNotification {
  id: string;
  parentId: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "message";
  isChecked: boolean;
  color: string;
}

export const useParentNotifications = (parentId: string) => {
  const [notifications, setNotifications] = useState<ParentNotification[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!parentId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/unread/${parentId}`);
        setUnreadMessages(data);

        const mapped: ParentNotification[] = data.map((msg) => ({
          id: `${msg.senderId}_${msg.studentId}`,
          parentId: msg.receiverId,
          teacherId: msg.senderId,
          studentId: String(msg.studentId),
          studentName: msg.studentName || "מורה לא מזוהה",
          message: msg.content,
          timestamp: msg.timestamp,
          read: false,
          type: "message",
          isChecked: false,
          color: "",
        }));

        setNotifications((prev) => [
          ...prev.filter((n) => n.type !== "message"),
          ...mapped,
        ]);
      } catch (err) {
        console.error("Error fetching parent notifications:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [parentId]);

  const markAsRead = async (teacherId: string, studentId: string) => {
    const toMark = unreadMessages.filter(
      (m) => m.senderId === teacherId && m.studentId === studentId
    );

    try {
      await Promise.all(
        toMark.map((m) => axios.patch(`/api/messages/${m._id}/read`, {}))
      );

      setUnreadMessages((prev) =>
        prev.filter(
          (m) => !(m.senderId === teacherId && m.studentId === studentId)
        )
      );

      setNotifications((prev) =>
        prev.filter(
          (n) => !(n.teacherId === teacherId && n.studentId === studentId)
        )
      );
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לסמן כהודעות נקראו",
        variant: "destructive",
      });
    }
  };

  return {
    notifications,
    markAsRead,
    setNotifications,
  };
};
