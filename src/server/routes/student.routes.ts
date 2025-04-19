// src/server/routes/students.ts
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { StudentProfile } from '../models/StudentProfile';

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const teacherIdRaw = req.query.teacherId as string;
  if (!teacherIdRaw) {
    res.status(400).json({ message: "Missing teacherId" });
    return;
  }

  let teacherId: mongoose.Types.ObjectId;
  try {
    teacherId = new mongoose.Types.ObjectId(teacherIdRaw);
  } catch {
    res.status(400).json({ message: "Invalid teacherId format" });
    return;
  }

  try {
    const docs = await StudentProfile.find({ teacherId })
      // שמים את השדה הנכון: "class" ולא "className"
      .select("firstName lastName class parentIds avatar")
      .lean();

    const students = docs.map(doc => ({
      id:        doc._id.toString(),
      firstName: doc.firstName,
      lastName:  doc.lastName,
      // מיפוי לשדה הקיים
      class:     doc.class, 
      parentIds: doc.parentIds.map(pid => pid.toString()),
      avatar:    doc.avatar || ""
    }));

    res.status(200).json(students);
  } catch (error) {
    console.error("Error in /students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
