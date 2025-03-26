
import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/Message';

const router = Router();

// Get all messages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find({}).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

// Get messages for a specific user (either sender or receiver)
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: 'Error fetching user messages', error });
  }
});

// Get conversation between two users
router.get('/conversation/:userId1/:userId2', async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Error fetching conversation', error });
  }
});

// Get unread messages for a user
router.get('/unread/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const messages = await MessageModel.find({
      receiverId: userId,
      isRead: false
    }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ message: 'Error fetching unread messages', error });
  }
});

// Send a new message
router.post('/', async (req: Request, res: Response) => {
  try {
    const message = new MessageModel(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).json({ message: 'Error creating message', error });
  }
});

// Mark message as read
router.patch('/:messageId/read', async (req: Request, res: Response) => {
  try {
    const message = await MessageModel.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Error updating message', error });
  }
});

// Delete a message
router.delete('/:messageId', async (req: Request, res: Response) => {
  try {
    const message = await MessageModel.findByIdAndDelete(req.params.messageId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message', error });
  }
});

export { router as messageRouter };
