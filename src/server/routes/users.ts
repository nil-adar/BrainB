import { Router, Request, Response } from 'express';
import { User as UserModel, IUser } from '../models/User';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; 

const router = Router();

// Get all users
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get user by MongoDB _id


// Get teacher's classes
router.get('/:id/classes', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select('role assignedClasses schoolId schoolName')
      .lean<IUser>();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.role !== 'teacher') {
      res.status(403).json({ success: false, message: 'User is not a teacher' });
      return;
    }

    const assignedClasses = (user.assignedClasses || []).map(cls =>
      typeof cls === "string"
        ? {
            classId: cls,
            className: cls,
            schoolId: user.schoolId || "",
            schoolName: user.schoolName || ""
          }
        : cls
    );

    res.json({ success: true, classes: assignedClasses });
  } catch (error) {
    console.error('❌ Error fetching assigned classes:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uniqueId, password } = req.body;
    if (!uniqueId || !password) {
      res.status(400).json({ message: 'ID and password are required' });
      return;
    }

    const user = await UserModel.findOne({ uniqueId });
    if (!user) {
      res.status(401).json({ message: 'משתמש לא רשום במערכת. אנא הירשם תחילה' });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ message: 'סיסמה שגויה' });
      return;
    }

    const userWithoutPassword = { ...user.toObject(), password: undefined };
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
});

// Register new user
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uniqueId, email, name, phone, password, role } = req.body;
    if (!uniqueId || !email || !password || !phone || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await UserModel.findOne({ 
      $or: [ { uniqueId }, { email } ]
    });

    if (existingUser) {
      res.status(400).json({ 
        message: existingUser.uniqueId === uniqueId 
          ? 'משתמש עם תעודת זהות זו כבר קיים במערכת' 
          : 'משתמש עם אימייל זה כבר קיים במערכת' 
      });
      return;
    }

    const user = new UserModel({
      uniqueId,
      email,
      name: name || uniqueId,
      phone,
      password,
      role,
      childrenIds: role === 'parent' ? [] : undefined,
      teacherId: role === 'student' ? undefined : undefined,
      parentIds: role === 'student' ? [] : undefined,
    });

    await user.save();
    const userWithoutPassword = { ...user.toObject(), password: undefined };
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error registering user:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'שגיאת אימות נתונים', details: error.message });
    } else {
      res.status(500).json({ message: 'אירעה שגיאה בהרשמה', error: String(error) });
    }
  }
});

// Get user by uniqueId
router.get('/unique/:uniqueId', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOne({ uniqueId: req.params.uniqueId }, { password: 0 });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Update user
router.put('/:uniqueId', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { uniqueId: req.params.uniqueId },
      req.body,
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Delete user
router.delete('/:uniqueId', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOneAndDelete({ uniqueId: req.params.uniqueId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

export { router as userRouter };
