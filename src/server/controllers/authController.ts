/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Helper function to get translations
const getMessages = (lang: string) => {
  const messages = {
    he: {
      MISSING_CREDENTIALS: "נא להזין ת.ז וסיסמה",
      USER_NOT_FOUND: "משתמש לא נמצא",
      WRONG_PASSWORD: "סיסמה שגויה",
      SERVER_ERROR: "שגיאה בשרת",
      MISSING_FIELDS: "נא למלא את כל השדות החיוניים",
      USER_NOT_APPROVED: "משתמש לא מאושר או כבר רשום",
      ROLE_MISMATCH: "אין אפשרות להירשם עם תפקיד שונה",
      MISSING_ID_PHONE: "נא להזין ת.ז וטלפון",
      INVALID_DETAILS: "פרטים לא תקינים",
      MISSING_PASSWORD: "נא להזין סיסמה חדשה",
      INVALID_TOKEN: "טוקן לא תקין",
      TOKEN_EXPIRED: "טוקן לא תקין או שפג תוקפו",
      PASSWORD_UPDATED: "הסיסמה עודכנה בהצלחה",
    },
    en: {
      MISSING_CREDENTIALS: "Please enter ID and password",
      USER_NOT_FOUND: "User not found",
      WRONG_PASSWORD: "Invalid password",
      SERVER_ERROR: "Server error",
      MISSING_FIELDS: "Please fill all required fields",
      USER_NOT_APPROVED: "User not approved or already registered",
      ROLE_MISMATCH: "Cannot register with different role",
      MISSING_ID_PHONE: "Please enter ID and phone number",
      INVALID_DETAILS: "Invalid details",
      MISSING_PASSWORD: "Please enter new password",
      INVALID_TOKEN: "Invalid token",
      TOKEN_EXPIRED: "Invalid token or token expired",
      PASSWORD_UPDATED: "Password updated successfully",
    },
  };
  return messages[lang as "he" | "en"] || messages.en;
};

// Login
export async function login(req: Request, res: Response): Promise<void> {
  const { uniqueId, password } = req.body;
  const lang = req.headers["accept-language"] || "en";
  const t = getMessages(lang);

  if (!uniqueId || !password) {
    res.status(400).json({ message: t.MISSING_CREDENTIALS });
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
      res.status(404).json({ message: t.USER_NOT_FOUND });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: t.WRONG_PASSWORD });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

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
    res.status(500).json({ message: t.SERVER_ERROR, error });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  const { uniqueId, name, password, email, phone, role } = req.body;
  const lang = req.headers["accept-language"] || "en";

  if (!uniqueId || !name || !password || !role || !phone) {
    res.status(400).json({
      message:
        lang === "he"
          ? "נא למלא את כל השדות החיוניים"
          : "Please fill all required fields",
    });
    return;
  }

  try {
    // Normalize phone number (remove non-digits)
    const normalizePhone = (p: string) => (p || "").replace(/\D/g, "");
    const normPhone = normalizePhone(phone);

    // Search for user by phone (with or without dashes)
    const user = await User.findOne({
      $or: [{ phone }, { phone: normPhone }],
    });

    // If no user found with this phone number
    if (!user) {
      res.status(404).json({
        message:
          lang === "he"
            ? "מספר הטלפון לא נמצא במערכת. רק משתמשים שנמצאים במערכת בית הספר יכולים לבצע רישום ל-BrainBridge."
            : "Phone number not found in system. Only users registered in the school system can sign up for BrainBridge.",
      });
      return;
    }

    // Check if user already completed registration
    if (user.isActivated) {
      res.status(400).json({
        message:
          lang === "he"
            ? "המשתמש כבר רשום במערכת. אנא התחבר."
            : "User already registered. Please login.",
      });
      return;
    }

    // Verify role matches
    if (user.role !== role) {
      res.status(403).json({
        message:
          lang === "he"
            ? `התפקיד שבחרת (${role}) לא תואם לתפקיד שלך במערכת (${user.role}).`
            : `Selected role (${role}) does not match your system role (${user.role}).`,
      });
      return;
    }

    // Get name from system (could be full name or firstName + lastName)
    const nameInSystem =
      user.name || `${user.firstName} ${user.lastName}`.trim();

    // Normalize names for comparison (ignore extra spaces)
    const normalizeName = (n: string) => n.trim().replace(/\s+/g, " ");
    if (nameInSystem && normalizeName(nameInSystem) !== normalizeName(name)) {
      res.status(400).json({
        message:
          lang === "he"
            ? `השם שהזנת (${name}) לא תואם לשם במערכת (${nameInSystem}). אנא בדוק את הפרטים.`
            : `Name entered (${name}) does not match system records (${nameInSystem}). Please verify details.`,
      });
      return;
    }

    // Verify email if it exists in system
    if (user.email && user.email !== email) {
      res.status(400).json({
        message:
          lang === "he"
            ? `האימייל שהזנת (${email}) לא תואם לאימייל במערכת (${user.email}). אנא בדוק את הפרטים.`
            : `Email entered (${email}) does not match system records (${user.email}). Please verify details.`,
      });
      return;
    }

    // All validations passed - complete registration
    const hashedId = await bcrypt.hash(uniqueId, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    user.uniqueId = hashedId;
    user.password = hashedPassword;
    user.isActivated = true;

    // Update name and email only if they weren't already set
    if (!user.name) user.name = name;
    if (!user.email) user.email = email;

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

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
    console.error("❌ Error in registration:", error);
    res.status(500).json({
      message:
        lang === "he"
          ? "שגיאת שרת. אנא נסה שוב מאוחר יותר."
          : "Server error. Please try again later.",
    });
  }
}

export async function resetInit(req: Request, res: Response): Promise<void> {
  const { uniqueId, phone } = req.body;
  const lang = req.headers["accept-language"] || "en";
  const t = getMessages(lang);

  if (!uniqueId || !phone) {
    res.status(400).json({ message: t.MISSING_ID_PHONE });
    return;
  }

  try {
    const normalize = (p: string) => (p || "").replace(/\D/g, "");
    const normPhone = normalize(phone);
    const user = await User.findOne({
      $or: [{ phone }, { phone: normPhone }],
      isActivated: true,
    });

    if (!user || !user.uniqueId) {
      res.status(404).json({ message: t.INVALID_DETAILS });
      return;
    }

    const isIdMatch = await bcrypt.compare(uniqueId, user.uniqueId);
    if (!isIdMatch) {
      res.status(404).json({ message: t.INVALID_DETAILS });
      return;
    }

    const resetToken = jwt.sign(
      { id: user._id, purpose: "reset" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: t.SERVER_ERROR, error });
  }
}

export async function resetComplete(
  req: Request,
  res: Response
): Promise<void> {
  const { resetToken, newPassword } = req.body;
  const lang = req.headers["accept-language"] || "en";
  const t = getMessages(lang);

  if (!resetToken || !newPassword) {
    res.status(400).json({ message: t.MISSING_PASSWORD });
    return;
  }

  try {
    const payload: any = jwt.verify(resetToken, JWT_SECRET);
    if (payload?.purpose !== "reset" || !payload?.id) {
      res.status(401).json({ message: t.INVALID_TOKEN });
      return;
    }

    const user = await User.findById(payload.id);
    if (!user) {
      res.status(404).json({ message: t.USER_NOT_FOUND });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: t.PASSWORD_UPDATED });
  } catch (error) {
    res.status(401).json({ message: t.TOKEN_EXPIRED });
  }
}
