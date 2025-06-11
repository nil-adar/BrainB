
import express, { Request, Response } from "express";
import { FormModel } from "../models/FormModel"; 

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {

  try {
    const { studentId, role, questionnaireId, answers, tags } = req.body;

    const newForm = new FormModel({
      studentId,
      role,
      questionnaireId, 
      answers,
      tags, 
      submittedAt: new Date(),
    });

    await newForm.save();

    res.status(201).json({ message: "Form saved successfully" });
  } catch (error) {
    console.error(" Failed to save form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// בדיקה האם כבר קיים שאלון מורה עבור תלמיד מסוים
router.get("/check-status/:studentId", async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const existingForm = await FormModel.findOne({
      studentId,
      role: "teacher", // בדיקה רק עבור שאלון מורה
    });

    res.status(200).json({ hasTeacherForm: !!existingForm });

  } catch (error) {
    console.error(" Error checking form status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
