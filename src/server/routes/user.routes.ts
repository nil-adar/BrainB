import express, { Request, Response, Router } from 'express';
import { User, IUser } from '../models/User'; // ✅ ייבוא של המודל ושל האינטרפייס
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// ✅ שליפת משתמש מחובר לפי ה־token
router.get('/me', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ שליפה רגילה לפי ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email phone role schoolId schoolName assignedClasses')
      .lean<IUser>();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('❌ Server error in /users/:id:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ✅ עדכון שדות בפרופיל המשתמש לפי ID
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/:id/classes', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('role assignedClasses');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'User is not a teacher' });
      return;
    }

    const assignedClasses = user.assignedClasses || [];
    res.json({ success: true, classes: assignedClasses });

  } catch (error) {
    console.error('❌ Error fetching assigned classes:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/profiles/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email phone role schoolId schoolName assignedClasses')
      .lean<IUser>();

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export { router as userRouter };
