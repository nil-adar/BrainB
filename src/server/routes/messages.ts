import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/Message';

const router = Router();

// שליפת שיחה בין שני משתמשים
router.get(
  '/conversation/:userId1/:userId2/:studentId',
  async (req: Request, res: Response) => {
    try {
      const { userId1, userId2, studentId } = req.params;
      const messages = await MessageModel.find({
        studentId, // מסנן גם לפי תלמיד
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      console.error('❌ Error fetching conversation:', error);
      res.status(500).json({ message: 'Error fetching conversation', error });
    }
  }
);

// שליחת הודעה חדשה
router.post('/', async (req: Request, res: Response) => {
  console.log('Received message payload:', req.body);

  try {
    const newMessage = new MessageModel(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(400).json({ message: 'Error sending message', error });
  }
});

// שליפת הודעות שלא נקראו למשתמש מסוים (למורה)
router.get('/unread/:receiverId', async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.params;

    const messages = await MessageModel.find({
      receiverId,
      isRead: false
    }).populate('studentId', 'name'); // שולף את שם התלמיד בלבד

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      studentId: (msg.studentId as any)?._id || '',
      studentName: (msg.studentId as any)?.name || 'תלמיד לא ידוע',
      content: msg.content,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
      senderRole: msg.senderRole
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching unread messages:', error);
    res.status(500).json({ message: 'Error fetching unread messages', error });
  }
});

// סימון הודעה כנקראה
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await MessageModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('❌ Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read', error });
  }
});


export { router as messageRouter };
