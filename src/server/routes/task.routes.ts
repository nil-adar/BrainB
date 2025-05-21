// 📍 routes/task.routes.ts

import express, { Request, Response } from "express";
import { DailyTaskModel } from "../models/DailyTaskModel";

const router = express.Router();

// POST /api/tasks - שמירת משימות לתלמיד/כיתה
router.post("/tasks", async (req: Request, res: Response): Promise<void> => {
  const tasks = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    res.status(400).json({ error: "No tasks provided" });
    return;
  }

  try {
    console.log("📥 Received tasks:", tasks);
    console.log("🛠 task[0] fields:", Object.keys(tasks[0]));

    const inserted = await DailyTaskModel.insertMany(tasks);
    res.status(201).json(inserted);
  } catch (err) {
    console.error("❌ Failed to save tasks:", err);
    res.status(500).json({ error: "Failed to save tasks", details: err });
  }
});

// GET /api/tasks/:studentId?date=YYYY-MM-DD - קבלת משימות לתלמיד לפי תאריך
router.get("/tasks/:studentId", async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;
  const { date } = req.query;

  if (!studentId || !date) {
    res.status(400).json({ error: "Missing studentId or date" });
    return;
  }

  try {
    const parsedDate = new Date(date as string);
    console.log(`🔍 Fetching tasks for student ${studentId} on date ${parsedDate.toISOString()}`);

    const tasks = await DailyTaskModel.find({
      $or: [
        { studentId },
        { studentId: null, classId: req.query.classId } // Include classId if given
      ],
      date: parsedDate
    });

    res.json(tasks);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

export default router;