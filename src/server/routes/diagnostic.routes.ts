import express, { Request, Response } from "express";
import { DiagnosticSessionModel } from "../models/DiagnosticSession";
import mongoose from "mongoose";
import crypto from "crypto";
import { DiagnosticResultModel } from "../models/DiagnosticResult";
const NODUS_BASE_URL =
  process.env.NODUS_BASE_URL || "http://127.0.0.1:8000";
const router = express.Router();

// יצירת סשן אבחון חיצוני לתלמיד
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  console.log("📥 שלב 3: הבקשה התקבלה בשרת עם הנתונים:", req.body);
  const { studentId } = req.body;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ error: "Invalid or missing studentId" });
    return;
  }

  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // תוקף ל־24 שעות

  try {
    const session = await DiagnosticSessionModel.create({
      studentId,
      sessionToken: token,
      expiresAt,
      status: "pending",
    });

    res.status(201).json({
      message: "Diagnostic session created",
      sessionUrl: `${NODUS_BASE_URL}/?token=${token}&studentId=${studentId}`,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    console.error("Error creating diagnostic session:", err);
    res.status(500).json({ error: "Failed to create diagnostic session" });
  }
});

// בדיקה אם טוקן קיים - נוסיף בהמשך אם צריך
router.get("/validate/:token", async (req: Request, res: Response): Promise<void> => {
  const token = req.params.token;

  try {
    const session = await DiagnosticSessionModel.findOne({ sessionToken: token });

    if (!session) {
      res.status(404).json({ error: "Token not found" });
      return;
    }

    if (session.expiresAt < new Date()) {
      res.status(410).json({ error: "Token expired" });
      return;
    }

    res.status(200).json({ message: "Token is valid", studentId: session.studentId });
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(500).json({ error: "Failed to validate token" });
  }
});

// בדיקה אם יש אבחון פעיל עבור תלמיד
router.get("/has-active/:studentId", async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ valid: false, error: "Invalid studentId" });
    return;
  }

  try {
    const session = await DiagnosticSessionModel.findOne({
      studentId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (session) {
      res.status(200).json({
        valid: true,
        sessionToken: session.sessionToken,
      });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (err) {
    console.error("שגיאה בבדיקת סשן אבחון:", err);
    res.status(500).json({ valid: false, error: "Server error" });
  }
});
router.get("/session/:studentId", async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;

  try {
    const session = await DiagnosticSessionModel.findOne({
      studentId,
      expiresAt: { $gt: new Date() }, // רק אם לא פג תוקף
    });

    if (!session) {
      res.status(404).json({ message: "אין אבחון זמין" });
      return;
    }

    res.status(200).json({
      sessionUrl: `${NODUS_BASE_URL}/?token=${session.sessionToken}&studentId=${studentId}`,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ error: "שגיאה בבדיקת האבחון" });
  }
});
router.post("/results", async (req: Request, res: Response): Promise<void> => {
  const { sessionToken, percentages, dominantSubtype, timestamp } = req.body;

  if (
    !sessionToken ||
    !Array.isArray(percentages) ||
    percentages.length !== 4 ||
    !dominantSubtype
  ) {
    res.status(400).json({ error: "Missing or invalid data" });
    return;
  }

  try {
    const session = await DiagnosticSessionModel.findOne({ sessionToken });
    console.log("🔍 Session loaded:", session); //
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // ✅ שמירה במסד הנתונים
    await DiagnosticResultModel.create({
      studentId: session.studentId,
      sessionToken: session.sessionToken,
      percentages,
      
      dominantSubtype,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    // אפשר לעדכן את הסטטוס של הסשן ל-"completed"
    session.status = "completed";
    await session.save();

    res.status(201).json({ message: "Diagnostic results saved successfully" });
  } catch (err) {
    console.error("Error saving results:", err);
    res.status(500).json({ error: "Failed to save diagnostic results" });
  }
});

export default router;
