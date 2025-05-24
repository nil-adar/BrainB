// 📍 routes/task.routes.ts

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { DailyTaskModel } from "../models/DailyTaskModel";

const router = express.Router();

// POST /api/tasks
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

// ✅ GET /api/tasks/:studentId
router.get("/tasks/:studentId", async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;
  const { date, classId } = req.query;

  if (!studentId || !date) {
    res.status(400).json({ error: "Missing studentId or date" });
    return;
  }

  try {
    const parsedDate = new Date(date as string);
    parsedDate.setHours(0, 0, 0, 0);

    const endDate = new Date(parsedDate);
    endDate.setHours(23, 59, 59, 999);

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    console.log(`🔍 Fetching tasks for student ${studentId} on ${parsedDate.toISOString()} - ${endDate.toISOString()}`);

    const tasks = await DailyTaskModel.find({
      date: { $gte: parsedDate, $lte: endDate },
      $or: [
        { studentId: studentObjectId },
        { studentId: null, classId }
      ]
    });

    console.log(`✅ Found ${tasks.length} tasks`);
    res.json(tasks);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
router.put("/tasks/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await DailyTaskModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update task:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});






export default router;
