import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// התחברות
export async function login(req: Request, res: Response): Promise<void> {
  const { uniqueId, password } = req.body;

  if (!uniqueId || !password) {
    res.status(400).json({ message: 'נא להזין ת.ז וסיסמה' });
    return;
  }

  try {
    const users = await User.find({ isActivated: true });

    let user: any = null;

    for (const u of users) {
   
      if (!u.uniqueId) continue;

      const isIdMatch = await bcrypt.compare(uniqueId, u.uniqueId);
      if (isIdMatch) {
        user = u;
        break;
      }
    }

    if (!user) {
      res.status(404).json({ message: 'משתמש לא נמצא' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'סיסמה שגויה' });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });


    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת', error });
  }
}


export async function register(req: Request, res: Response): Promise<void> {
  const { uniqueId, name, password, email, phone, role } = req.body;

  if (!uniqueId || !name || !password || !role || !phone) {
    res.status(400).json({ message: 'נא למלא את כל השדות החיוניים' });
    return;
  }

  try {
    // חיפוש לפי טלפון ותפקיד
    const user = await User.findOne({ phone, role, isActivated: false });
    if (!user) {
      res.status(404).json({ message: 'משתמש לא מאושר או כבר רשום' });
      return;
    }

    //       
    if (user.role !== role) {
      res.status(403).json({ message: 'אין אפשרות להירשם עם תפקיד שונה' });
      return;
    }

    // הצפנה של ת"ז וסיסמה
    const hashedId = await bcrypt.hash(uniqueId, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // עדכון פרטי המשתמש במסד
    user.name = name;
    user.email = email;
    user.uniqueId = hashedId;
    user.password = hashedPassword;
    user.isActivated = true;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });// במערכת שלנו תוקף הטוקן לשעתיים 


    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error('❌ שגיאה בהרשמה:', error);
    res.status(500).json({ message: 'שגיאה בשרת', error });
  }
}
