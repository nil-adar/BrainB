
import express, { Request, Response } from "express";
import { FormModel } from "../models/FormModel"; 

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {

  try {
    const { studentId, role, formType, answers } = req.body;

    // 📝 דוגמה לשמירה במסד
    const newForm = new FormModel({
      studentId,
      role,
      formType,
      answers,
      submittedAt: new Date(),
    });

    await newForm.save();

    res.status(201).json({ message: "Form saved successfully" });
  } catch (error) {
    console.error("❌ Failed to save form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
