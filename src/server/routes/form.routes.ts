import express, { Request, Response } from "express";
import { FormModel } from "../models/FormModel";
import mongoose from "mongoose";
import { DiagnosticResultModel } from "../models/DiagnosticResult";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
  console.log("💾 Received form payload:", JSON.stringify(req.body, null, 2));
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

router.get(
  "/check-status/:studentId",
  async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;
    console.log("🔍 Checking status for studentId:", studentId);

    try {
      // בדיקת טפסים - תמיד מחפש לפי string
      const [studentForm, parentForm, teacherForm] = await Promise.all([
        FormModel.findOne({ studentId, role: "student" }),
        FormModel.findOne({ studentId, role: "parent" }),
        FormModel.findOne({ studentId, role: "teacher" }),
      ]);

      // ✅ בדיקת אבחון - נסה שתי אפשרויות
      let diagnosisResult = null;

      // אפשרות 1: חיפוש לפי ObjectId (אם נשמר כ-ObjectId)
      if (mongoose.Types.ObjectId.isValid(studentId)) {
        diagnosisResult = await DiagnosticResultModel.findOne({
          studentId: new mongoose.Types.ObjectId(studentId),
        });
      }

      // אפשרות 2: אם לא נמצא, חפש לפי string (כמו שנראה בתמונות שלך)
      if (!diagnosisResult) {
        // חיפוש ישיר במסד הנתונים בטכניקה גמישה יותר
        diagnosisResult = await mongoose.connection
          .collection("diagnosticresults")
          .findOne({
            $or: [
              { studentId: studentId }, // כ-string
              {
                studentId: mongoose.Types.ObjectId.isValid(studentId)
                  ? new mongoose.Types.ObjectId(studentId)
                  : null,
              }, // כ-ObjectId
            ].filter(Boolean), // מסנן null values
          });
      }

      const result = {
        studentFormCompleted: !!studentForm,
        parentFormCompleted: !!parentForm,
        teacherFormCompleted: !!teacherForm,
        diagnosisCompleted: !!diagnosisResult,
      };

      console.log("📋 Found forms:", {
        student: !!studentForm,
        parent: !!parentForm,
        teacher: !!teacherForm,
        diagnosis: !!diagnosisResult,
      });

      console.log("🔍 Diagnosis details:", {
        searchedId: studentId,
        foundDiagnosis: diagnosisResult
          ? {
              _id: diagnosisResult._id,
              studentId: diagnosisResult.studentId,
              studentIdType: typeof diagnosisResult.studentId,
            }
          : null,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("❌ Error checking form status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ נתיב לדיבוג - עזור לך להבין איך הנתונים נשמרים
router.get(
  "/debug-diagnosis/:studentId",
  async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;
    console.log("🐛 Debug diagnosis for studentId:", studentId);

    try {
      // בדוק עם המודל
      const modelResult = mongoose.Types.ObjectId.isValid(studentId)
        ? await DiagnosticResultModel.findOne({
            studentId: new mongoose.Types.ObjectId(studentId),
          })
        : null;

      // בדוק ישירות במסד הנתונים
      const directSearch = await mongoose.connection
        .collection("diagnosticresults")
        .find({})
        .toArray();

      // מצא את כל התוצאות שקשורות לתלמיד הזה
      const relatedResults = directSearch.filter(
        (doc) =>
          doc.studentId === studentId || doc.studentId?.toString() === studentId
      );

      res.json({
        studentId,
        modelResult: !!modelResult,
        totalDiagnosticResults: directSearch.length,
        relatedResults: relatedResults.map((doc) => ({
          _id: doc._id,
          studentId: doc.studentId,
          studentIdType: typeof doc.studentId,
          isObjectId: mongoose.Types.ObjectId.isValid(
            doc.studentId?.toString()
          ),
          matchesInput:
            doc.studentId === studentId ||
            doc.studentId?.toString() === studentId,
        })),
        allStudentIds: [...new Set(directSearch.map((doc) => doc.studentId))],
      });
    } catch (error) {
      console.error("❌ Error in debug diagnosis:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
