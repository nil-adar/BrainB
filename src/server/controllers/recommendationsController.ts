import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DiagnosticResultModel } from "../models/DiagnosticResult";
import { RecommendationModel } from "../models/RecommendationModel";
import { FormModel } from "../models/FormModel";
import { QuestionModel } from "../models/QuestionModel";

// Constants from the pipeline documentation
const MIN_NO_ADHD_VAL = 0.7;
const MIN_INATT_VAL = 0.2;
const MIN_HYPER_VAL = 0.25;

console.log("🐛 recommendationsController mounted"); //המלצות

// Create an Express router to hold our endpoint
const router = express.Router();

/**
 * GET /api/recommendations/:studentId
 *
 * Implements the complete 11-stage recommendation pipeline:
 * Stages 1-6: ADHD Classification Logic (Figure 1)
 * Stages 7-11: Environmental and Recommendation Filtering (Figure 2)
 */
router.get(
  "/recommendations/:studentId",
  async (
    req: Request<{ studentId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    //
    console.log(
      "🚀 Entered /api/recommendations handler for",
      req.params.studentId
    );

    try {
      //Validate and parse studentId
      const { studentId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ error: "Invalid studentId" });
        return;
      }

      //Load the latest diagnosticResult document for this student
      const diag = await DiagnosticResultModel.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
      })
        .sort({ createdAt: -1 })
        .exec();

      if (!diag) {
        console.log("⚠️ Stage 1 – no diag for studentId:", studentId); //בדיקה
        res.status(404).json({ error: "No diagnostic data found" });
        return;
      }

      const [combined_pct, hyper_pct, inatt_pct, noAdhd_pct] = diag.percentages;

      console.log(
        "💡 Stage 1 – percentages breakdown:\n" +
          `  🟠 Combined:     ${combined_pct}\n` +
          `  🔵 Hyperactive:  ${hyper_pct}\n` +
          `  🟡 Inattentive:  ${inatt_pct}\n` +
          `  ⚪ No ADHD:      ${noAdhd_pct}\n`
      ); //בדיקה

      // STAGE 1: Initial Screening Filter
      // Check if max(all_percentages) = NoAdhd threshold
      const maxPercentage = Math.max(
        combined_pct,
        hyper_pct,
        inatt_pct,
        noAdhd_pct
      );
      if (maxPercentage === noAdhd_pct && noAdhd_pct >= MIN_NO_ADHD_VAL) {
        console.log("🔍 Stage 1: No ADHD detected, terminating");
        res.json({
          noAdhd: true,
          message:
            "No signs for ADHD were detected, no need for recommendations",
          recommendations: [],
        });
        return;
      }

      // Load questionnaire forms in parallel
      const [studentForm, parentForm, teacherForm] = await Promise.all([
        FormModel.findOne({ studentId, role: "student" }),
        FormModel.findOne({ studentId, role: "parent" }),
        FormModel.findOne({ studentId, role: "teacher" }),
      ]);
      //check
      console.log("📊 Forms loaded:", {
        hasChild: !!studentForm,
        hasParent: !!parentForm,
        hasTeacher: !!teacherForm,
        studentAnswersCount: studentForm?.answers
          ? Object.keys(studentForm.answers).length
          : 0,
        parentAnswersCount: parentForm?.answers
          ? Object.keys(parentForm.answers).length
          : 0,
        teacherAnswersCount: teacherForm?.answers
          ? Object.keys(teacherForm.answers).length
          : 0,
      });

      // Extract and process all answers
      type AnswerPair = {
        questionId: string;
        response: string | string[];
      };

      const allForms = [studentForm, parentForm, teacherForm].filter(Boolean);
      //Convert each form.answers (Record<string, string|[]>)
      //into an array of { questionId, response } objects
      const allAnswers: AnswerPair[] = allForms.flatMap((form) => {
        if (!form?.answers) return [];
        return Object.entries(form.answers).map(([qid, resp]) => ({
          questionId: qid,
          response: resp,
        }));
      });

      // Generate answersByTag directly from allAnswers using embedded tags
      const answersByTag = allAnswers.map((a) => {
        const [qidPrefix] = a.questionId.split("-");
        let tag = "";

        if (qidPrefix.startsWith("q1")) tag = "student";
        else if (qidPrefix.startsWith("q2")) tag = "parent";
        else if (qidPrefix.startsWith("q3")) tag = "teacher";

        // Add special tags by ID
        if (a.questionId.includes("q2-16")) tag = "subtype";
        if (a.questionId.includes("q2-19")) tag = "allergy";
        if (a.questionId.includes("q2-27")) tag = "env_onset";
        if (a.questionId.includes("q2-28")) tag = "env_trigger";

        return {
          tag,
          answer: a.response,
          questionId: a.questionId,
        };
      });

      const selectedTags: string[] = [
        ...(studentForm?.tags || []),
        ...(parentForm?.tags || []),
        ...(teacherForm?.tags || []),
      ];

      //check
      console.log("🏷️ Answers mapped to tags:", {
        totalMapped: answersByTag.length,
        tagsFound: answersByTag.filter((a) => a.tag).length,
        sampleTags: answersByTag
          .slice(0, 3)
          .map((a) => ({ tag: a.tag, answer: a.answer })),
      });

      // STAGE 2-6: Classification Logic
      let recommendationList: string[] = []; //will hold the sutble ADHD types
      const flags: Set<string> = new Set(); //will hold the ADHDtypes in a temp way to add later to the recommendationList

      // STAGE 2: Combined vs. Subtype Differentiation
      if (Math.max(hyper_pct, inatt_pct, combined_pct) === combined_pct) {
        console.log("🔍 Stage 2: Combined type detected");
        recommendationList.push("Combined");
      } else {
        // STAGE 3: Subtype Pathway Selection
        const mainType =
          hyper_pct >= inatt_pct ? "Hyperactivity" : "Inattention";
        console.log("🔍 Stage 3: Main type:", mainType);
        if (hyper_pct >= inatt_pct) {
          // Hyperactivity dominant path
          if (inatt_pct >= MIN_INATT_VAL) {
            flags.add("Inattention");
          }
          flags.add("Hyperactivity");
        } else {
          // Inattention dominant path
          flags.add("Inattention");
          if (hyper_pct >= MIN_HYPER_VAL) {
            // STAGE 4: Trigger parent questionnaire for secondary hyperactivity
            console.log(
              "🔍 Stage 4: Secondary hyperactivity check triggered\n"
            );
          } else {
            recommendationList.push("Inattention");
          }
        }
        // STAGE 4 & 5: Parent Questionnaire Processing
        // Find parent's subtype answer (q2-16: "Which behavior best describes your child?")
        const subtypeAnswer = answersByTag.find(
          (x) => x.tag === "subtype" || x.questionId.includes("q2-16")
        )?.answer as string | undefined;

        if (subtypeAnswer) {
          console.log(
            "🔍 Stage 5: Parent subtype answer:",
            subtypeAnswer,
            "\n"
          );
          switch (subtypeAnswer) {
            case "opt1": // Hyperactivity
              flags.add("Hyperactivity");
              break;
            case "opt2": // Impulsivity
              flags.add("Impulsivity");
              break;
            case "opt3": // Both
              flags.add("Hyperactivity");
              flags.add("Impulsivity");
              break;
            case "opt4": // None
              // Continue without additional flags
              break;
          }
        }

        // STAGE 6: Multi-Flag Consolidation Logic
        const flagArray = Array.from(flags);
        console.log("🔍 Stage 6: Active flags:", flagArray, "\n");

        if (flagArray.length === 1) {
          recommendationList = flagArray;
        } else {
          // Evaluate combination patterns
          const hasHyper = flags.has("Hyperactivity");
          const hasImpuls = flags.has("Impulsivity");
          const hasInatt = flags.has("Inattention");

          if (hasHyper && hasInatt && !hasImpuls) {
            recommendationList = ["Hyperactivity", "Inattentive"];
          } else if (hasImpuls && hasInatt && !hasHyper) {
            recommendationList = ["Impulsivity", "Inattentive"];
          } else if (hasHyper && hasImpuls && hasInatt) {
            recommendationList = ["Combined"];
          } else if (hasHyper && hasImpuls && !hasInatt) {
            recommendationList = ["Hyperactivity", "Impulsivity"];
          } else {
            recommendationList = flagArray;
          }
        }
      }
      console.log(
        "🔍 Stage 6 Complete: Recommendation list:",
        recommendationList,
        "\n"
      );

      // STAGE 7: Environmental Onset Screening
      let professionalSupport = false;

      // Find q2-27: "Have the behaviors always been present?"
      const alwaysPresentAnswer = answersByTag.find((x) =>
        x.questionId.includes("q2-27")
      )?.answer as string | undefined;

      if (alwaysPresentAnswer === "opt2") {
        // Symptoms started recently
        // Find q2-28: "Did any special event occur before symptoms started?"
        const specialEventAnswer = answersByTag.find((x) =>
          x.questionId.includes("q2-28")
        )?.answer as string | undefined;

        if (["opt2", "opt3", "opt4"].includes(specialEventAnswer || "")) {
          professionalSupport = true;
          console.log(
            "🔍 Stage 7: Environmental triggers detected, professional support flagged"
          );
        }
      }

      // STAGE 8: Filter by diagnosis_type
      let recommendations = await RecommendationModel.find({
        $or: [
          { diagnosis_type: { $in: recommendationList } }, // למשל אם diagnosis_type הוא מערך
          { diagnosis_type: recommendationList[0] }, // למשל אם diagnosis_type הוא מחרוזת
        ],
      }).lean();

      console.log(
        "🔍 Stage 8: Recommendations after diagnosis filter:",
        recommendations.length,
        "\n"
      );
      console.log(
        "🔍 Stage 8: Recommendations:",
        recommendations.map((r) => r.diagnosis_type)
      );
      console.log("🧩 Selected tags:", selectedTags);
      console.log("🧩 First recommendation tags:", recommendations[0]?.tags);
      console.log(
        "🧩 Stage 9 – tags in recommendation[0]:",
        recommendations[0]?.tags
      );
      console.log("🧩 Stage 9 – selectedTags:", selectedTags);
      console.log(
        "Selected tags include trauma_suspected?",
        selectedTags.includes("trauma_suspected")
      );

      // STAGE 9: Filter by tags from saved questionnaire forms
      if (selectedTags.length > 0) {
        recommendations = recommendations.filter((r) =>
          r.tags.some((tag) => selectedTags.includes(tag))
        );
        console.log(
          "🔍 Stage 9: Recommendations after saved-tag filter:",
          recommendations.length,
          "\n"
        );
      }

      // STAGE 10: Filtering by allergies
      const allergyAnswer = answersByTag.find((x) =>
        x.questionId.includes("q2-19")
      )?.answer as string | undefined;

      const allergyList: string[] = [];
      if (allergyAnswer === "yes" || allergyAnswer === "opt1") {
        // Compile allergy list from allergy-tagged questions
        answersByTag.forEach((item) => {
          if (item.tag === "allergy") {
            if (Array.isArray(item.answer)) {
              allergyList.push(...item.answer);
            } else {
              allergyList.push(item.answer);
            }
          }
        });

        // Remove examples that match allergy list
        recommendations = recommendations.map((rec) => {
          const filteredRec = { ...rec };

          // Filter English examples
          if (Array.isArray(rec.example.en)) {
            filteredRec.example.en = rec.example.en.filter(
              (example) => !allergyList.includes(example)
            );
          } else if (
            typeof rec.example.en === "string" &&
            allergyList.includes(rec.example.en)
          ) {
            filteredRec.example.en = "";
          }

          // Filter Hebrew examples
          if (Array.isArray(rec.example.he)) {
            filteredRec.example.he = rec.example.he.filter(
              (example) => !allergyList.includes(example)
            );
          } else if (
            typeof rec.example.he === "string" &&
            allergyList.includes(rec.example.he)
          ) {
            filteredRec.example.he = "";
          }

          return filteredRec;
        });

        console.log(
          "🔍 Stage 10: Allergy filtering applied, allergy list:",
          allergyList,
          "\n"
        );
      }
      // STAGE 11: Present relevant recommendations
      interface RecommendationResponse {
        recommendations: typeof recommendations;
        answersByTag: Array<{
          tag: string;
          answer: string | string[];
          questionId: string;
        }>;
        professionalSupport: boolean;
        selectedTags: string[];
        allergyList: string[];
        recommendationList: string[];
        multipleTypes?: boolean;
        mainType?: string;
        subTypes?: string[];
        message?: string;
      }

      const finalResponse: RecommendationResponse = {
        recommendations,
        answersByTag,
        professionalSupport,
        selectedTags,
        allergyList,
        recommendationList,
      };

      if (recommendationList.length > 1) {
        const mainType = recommendationList[0];
        const subTypes = recommendationList.slice(1);

        finalResponse.multipleTypes = true;
        finalResponse.mainType = mainType;
        finalResponse.subTypes = subTypes;
        finalResponse.message = `Your child's main diagnosis is ${mainType}, but we also detected some traits of ${subTypes.join(
          ", "
        )}.`;

        // Check if user wants both types or just main
        const viewBoth = req.query.viewBoth === "true";
        if (!viewBoth) {
          // Filter to show only main type recommendations
          finalResponse.recommendations = recommendations.filter(
            (r) => r.diagnosis_type === mainType
          );
        }
      }

      console.log(
        "🔍 Stage 11 Complete: Final recommendations:",
        finalResponse.recommendations.length,
        "\n"
      );
      res.json(finalResponse);
    } catch (err) {
      console.error("❌ Error in recommendations controller:", err);
      next(err);
    }
  }
);

/**
 * GET /api/recommendations/:studentId/debug
 * Debug endpoint to see the step-by-step pipeline execution
 */
router.get(
  "/recommendations/:studentId/debug",
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

      const [combined_pct, hyper_pct, inatt_pct, noAdhd_pct] = diag.percentages;

      const debugInfo = {
        stage1_screening: {
          percentages: { combined_pct, hyper_pct, inatt_pct, noAdhd_pct },
          maxPercentage: Math.max(
            combined_pct,
            hyper_pct,
            inatt_pct,
            noAdhd_pct
          ),
          noAdhdThresholdMet: noAdhd_pct >= MIN_NO_ADHD_VAL,
          shouldTerminate:
            Math.max(combined_pct, hyper_pct, inatt_pct, noAdhd_pct) ===
              noAdhd_pct && noAdhd_pct >= MIN_NO_ADHD_VAL,
        },
        stage2_classification: {
          combinedDominant:
            Math.max(hyper_pct, inatt_pct, combined_pct) === combined_pct,
          hyperDominant: hyper_pct >= inatt_pct,
          mainType: hyper_pct >= inatt_pct ? "Hyperactivity" : "Inattention",
        },
        thresholds: {
          MIN_NO_ADHD_VAL,
          MIN_INATT_VAL,
          MIN_HYPER_VAL,
        },
      };

      res.json(debugInfo);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
