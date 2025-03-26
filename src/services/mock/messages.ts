
import { Message } from "@/types/school";

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "t1",
    receiverId: "p1",
    content: "תלמידך השתתף היטב בשיעור היום",
    timestamp: "2024-02-20T10:00:00",
    isRead: false,
    senderRole: "teacher"
  },
  {
    id: "m2",
    senderId: "p1",
    receiverId: "t1",
    content: "תודה רבה על העדכון",
    timestamp: "2024-02-20T10:30:00",
    isRead: true,
    senderRole: "parent"
  }
];
