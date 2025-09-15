import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DiagnosticResultModel } from "../models/DiagnosticResult";

const router = express.Router();

/**
 * GET /api/diagnostics/:studentId/analyze
 * debug endpoint: returns only percentages + primaryTypes
 */
router.get(
  "/diagnostics/:studentId/analyze",
  async (
    req: Request<{ studentId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { studentId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ error: "Invalid studentId" });
        return;
      }

      const diag = await DiagnosticResultModel.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
      })
        .sort({ createdAt: -1 })
        .exec();

      if (!diag) {
        res.status(404).json({ error: "No diagnostic data found" });
        return;
      }

      const [combined_pct, hyper_pct, inatt_pct] = diag.percentages;
      const primaryTypes: string[] = [];
      if (combined_pct >= 40 || Math.abs(hyper_pct - inatt_pct) < 20) {
        primaryTypes.push("Combined");
      } else if (hyper_pct > inatt_pct) {
        primaryTypes.push("Hyperactivity");
      } else {
        primaryTypes.push("Inattention");
      }

      res.json({
        percentages: [combined_pct, hyper_pct, inatt_pct],
        primaryTypes,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
