import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { FormModel } from "../models/FormModel";
import { DiagnosticResultModel } from "../models/DiagnosticResult";

const router = express.Router();

// GET /api/recommendation/status/:studentId
router.get("/status/:studentId", async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400).json({ error: "Invalid or missing studentId" });
    return;
  }

  try {
    const [studentForm, parentForm, teacherForm, diagnosisResult] = await Promise.all([
      FormModel.findOne({ studentId, role: "student", formType: "pre-diagnosis" }),
      FormModel.findOne({ studentId, role: "parent", formType: "parent-assessment" }),
      FormModel.findOne({ studentId, role: "teacher", formType: "teacher-assessment" }),
      DiagnosticResultModel.findOne({ studentId }),
    ]);

    res.status(200).json({
      studentFormCompleted: !!studentForm,
      parentFormCompleted: !!parentForm,
      teacherFormCompleted: !!teacherForm,
      diagnosisCompleted: !!diagnosisResult,
    });
  } catch (error) {
    console.error("🔴 Error checking recommendation status:", error);
    res.status(500).json({ error: "Failed to check recommendation status" });
  }
});

export default router;
