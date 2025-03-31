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
    const user = await User.findOne({ uniqueId });
    if (!user) {
      res.status(404).json({ message: 'משתמש לא נמצא' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'סיסמה שגויה' });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת', error });
  }
}

// הרשמה
// הרשמה
export async function register(req: Request, res: Response): Promise<void> {
  console.log("👉 Received registration body:", req.body);
  const { uniqueId, name, password, email, phone, role } = req.body;

  if (!uniqueId || !name || !password || !role) {
    console.warn("⚠️ Missing required fields");
    res.status(400).json({ message: 'נא למלא את כל השדות החיוניים' });
    return;
  }

  try {
    const existingUser = await User.findOne({ uniqueId });

    if (existingUser && existingUser.isActivated) {
      console.warn("⚠️ User already exists and is activated:", existingUser);
      res.status(400).json({ message: 'משתמש כבר קיים במערכת' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      console.log("ℹ️ Updating existing (non-activated) user...");
      existingUser.name = name;
      existingUser.email = email;
      existingUser.phone = phone;
      existingUser.role = role;
      existingUser.password = hashedPassword;
      existingUser.isActivated = true;

      await existingUser.save();
      console.log("✅ Existing user updated and saved:", existingUser);

      const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, JWT_SECRET);
      res.status(200).json({ user: existingUser, token });
      return;
    }

    // משתמש חדש
    const newUser = new User({
      uniqueId,
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      isActivated: true,
    });

    console.log("📦 Saving new user...");
    await newUser.save();
    console.log("✅ New user saved to DB:", newUser);

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET);
    res.status(201).json({ user: newUser, token });

  } catch (error) {
    console.error('❌ שגיאה בהרשמה:', error);
    res.status(500).json({ message: 'שגיאה בשרת', error });
  }
}
