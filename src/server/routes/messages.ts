import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/Message';

const router = Router();

// שליפת שיחה בין שני משתמשים
router.get('/conversation/:userId1/:userId2', async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 }); // סדר כרונולוגי עולה
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching conversation:', error);
    res.status(500).json({ message: 'Error fetching conversation', error });
  }
});

// שליחת הודעה חדשה
router.post('/', async (req: Request, res: Response) => {
  try {
    const newMessage = new MessageModel(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(400).json({ message: 'Error sending message', error });
  }
});

export { router as messageRouter };
