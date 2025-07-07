import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { DiagnosticResultModel } from "../models/DiagnosticResult";
import { RecommendationModel } from "../models/RecommendationModel";
import { FormModel } from "../models/FormModel";
import { QuestionModel } from "../models/QuestionModel";
import { allergyMapping } from "../../data/foodAllergyMapping";
import { filterExamplesByAllergy } from "../../utils/filterExamplesByAllergy";
import { StudentRecommendationsModel } from "../models/StudentRecommendations";
import { ParsedQs } from "qs";
import { translateDiagnosisType } from "@/utils/translateDiagnosisType";

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
    console.log("📤 sending request to recommendations");

    console.log(
      "🚀 Entered /api/recommendations handler for",
      req.params.studentId
    );

    try {
      const lang = req.query.lang === "he" ? "he" : "en";
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
          `  🟠 Combined:     ${combined_pct} \n` +
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

      type AnswerObject = {
        answer: string | string[];
        tag?: string | string[];
        type?: string;
        text?: { he?: string; en?: string };
      };

      // Extract and process all answers
      type AnswerPair = {
        questionId: string;
        response: string | string[];
        tag?: string[];
        type?: string;
      };

      const allForms = [studentForm, parentForm, teacherForm].filter(Boolean);
      // Extract structured answers
      const allAnswers: AnswerPair[] = allForms.flatMap((form) => {
        if (!form?.answers) return [];
        return Object.entries(form.answers).flatMap(([qid, obj]) => {
          /*console.log(typeof obj.answer);
          console.log("The obj answer is: ", obj.answer);
          if (!("answer" in obj)) {
            console.warn(`❗ Missing answer for questionId ${qid}`);
            console.warn("Raw object is:", obj);
          }*/
          const a = obj as any;
          /*console.log("a.response: ", a.response);
          console.log(form.answers[0].answer);
          console.log("Test2 typeof: ", typeof form.answers[0].answer);
          console.log("TESTTTTT: ", a.answer);*/

          return {
            questionId: qid,
            response: a.response,
            tag: Array.isArray(a.tag) ? a.tag : a.tag ? [a.tag] : [],
            type: a.type,
          };
        });
      });

      // Version using embedded tag/type from saved answers
      const answersByTag = allAnswers.map((a) => ({
        tag: Array.isArray(a.tag) ? a.tag : a.tag ? [a.tag] : [],
        response: a.response,
        questionId: a.questionId,
        type: a.type || "", // ← הוספה חשובה!
      }));

      /*console.log("Test1 - ", allAnswers[0].response);
      console.log(typeof allAnswers[0].response, "\n");*/

      // הדפסת כל הטאגים שנמצאו — כדי לבדוק אם יש בכלל 'allergy'
      const allTags = answersByTag.map((a) => a.tag);

      /*  const selectedTags: string[] = [
        ...(studentForm?.tags || []),
        ...(parentForm?.tags || []),
        ...(teacherForm?.tags || []),
      ];*/
      const selectedTags: string[] = [];
      let allergyList: string[] = [];

      //check
      console.log("🏷️ Answers mapped to tags:", {
        totalMapped: answersByTag.length,
        tagsFound: answersByTag.filter((a) => a.tag).length,
      });

      // STAGE 2-6: Classification Logic
      let recommendationTypesList: string[] = []; //will hold the sutble ADHD types
      const flags: Set<string> = new Set(); //will hold the ADHDtypes in a temp way to add later to the recommendationTypesList

      // STAGE 2: Combined vs. Subtype Differentiation
      if (Math.max(hyper_pct, inatt_pct, combined_pct) === combined_pct) {
        console.log("🔍 Stage 2: Combined type detected");
        recommendationTypesList.push("Combined");
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
            recommendationTypesList.push("Inattention");
          }
        }
        // STAGE 4 & 5: Parent Questionnaire Processing
        // Find parent's subtype answer (q2-16: "Which behavior best describes your child?")
        const subtypeAnswer = answersByTag.find(
          (x) => x.tag?.includes("subtype") || x.questionId.includes("q2-16")
        )?.response as string | undefined;

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
          recommendationTypesList = flagArray;
        } else {
          // Evaluate combination patterns
          const hasHyper = flags.has("Hyperactivity");
          const hasImpuls = flags.has("Impulsivity");
          const hasInatt = flags.has("Inattention");

          if (hasHyper && hasInatt && !hasImpuls) {
            recommendationTypesList = ["Hyperactivity", "Inattentive"];
          } else if (hasImpuls && hasInatt && !hasHyper) {
            recommendationTypesList = ["Impulsivity", "Inattentive"];
          } else if (hasHyper && hasImpuls && hasInatt) {
            recommendationTypesList = ["Combined"];
          } else if (hasHyper && hasImpuls && !hasInatt) {
            recommendationTypesList = ["Hyperactivity", "Impulsivity"];
          } else {
            recommendationTypesList = flagArray;
          }
        }
      }
      console.log(
        "🔍 Stage 6 Complete: Recommendation list:",
        recommendationTypesList,
        "\n"
      );

      // STAGE 7: Environmental Onset Screening
      let professionalSupport = false;

      // Find q2-27: "Have the behaviors always been present?"
      const alwaysPresentAnswer = answersByTag.find((x) =>
        x.questionId.includes("q2-27")
      )?.response as string | undefined;

      if (alwaysPresentAnswer === "opt2") {
        // Symptoms started recently
        // Find q2-28: "Did any special event occur before symptoms started?"
        const specialEventAnswer = answersByTag.find((x) =>
          x.questionId.includes("q2-28")
        )?.response as string | undefined;

        if (["opt2", "opt3", "opt4"].includes(specialEventAnswer || "")) {
          professionalSupport = true;
          console.log(
            "🔍 Stage 7: Environmental triggers detected, professional support flagged"
          );
        }
      }

      // STAGE 8: Filter by diagnosis_type
      let recommendations = await RecommendationModel.find({
        "diagnosis_type.en": { $in: recommendationTypesList },
      }).lean();

      console.log(
        "🔍 Stage 8: Recommendations after diagnosis filter:",
        recommendations.length,
        "\n"
      );

      console.log(
        "Selected tags include trauma_suspected?",
        selectedTags.includes("trauma_suspected")
      );

      answersByTag.forEach(({ tag, response, type, questionId }) => {
        /* console.log("Stage 9 - starting foreach  \n");
        console.log("the tag is: ", tag);
        console.log("The type of answer is : ", typeof response);
        console.log("the answer is: ", response);
        console.log("the type is: ", type);
        console.log("the questionId is: ", questionId);*/
        // 🟡 SINGLE + opt3/opt4 → שמור תג לסינון
        if (type === "single" && (response === "opt3" || response === "opt4")) {
          //console.log("Stage 9a \n");
          if (Array.isArray(tag)) {
            selectedTags.push(...tag);
            // console.log("Stage 9b \n");
          } else if (tag) {
            selectedTags.push(tag);
            // console.log("Stage 9c \n");
          }
        }

        //  console.log("Stage 9 - End of first 'if'  \n");

        // 🔵 q2-19 === yes/opt1 → מוסיפים 'allergy'
        if (
          questionId.includes("q2-19") &&
          (response === "yes" || response === "opt1")
        ) {
          selectedTags.push("allergy");
        }

        //  MULTIPLE שאלות עם תג allergy → ממיר לתוך allergyList
        if (
          type === "multiple" &&
          Array.isArray(tag) &&
          tag.includes("allergy")
        ) {
          const values = Array.isArray(response) ? response : [response];
          for (const code of values) {
            const mapped = allergyMapping[code as keyof typeof allergyMapping];
            if (mapped) {
              allergyList.push(mapped.en); // או .en אם את רוצה לסנן באנגלית
            }
          }
        }
      });

      //selectedTags = Array.from(new Set(selectedTags));
      allergyList = Array.from(new Set(allergyList));
      console.log("🏷️ Stage 9 selectedTags:", selectedTags);
      console.log("🧪 allergyList:", allergyList);
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
      console.log("🧪 Stage 10 – Allergy items to filter out:", allergyList);
      recommendations = recommendations.map((rec) => {
        const newRec = { ...rec };

        // טיפול ב-example.en
        if (rec.example?.en) {
          if (Array.isArray(rec.example.en)) {
            const { filtered, matches } = filterExamplesByAllergy(
              rec.example.en,
              allergyList
            );
            newRec.example.en = filtered;

            /*if (matches.length > 0) {
              console.log(
                `⚠️ Allergy match in recommendation ${rec._id} (EN array):`,
                matches
              );
            }*/
          } else {
            // לא נוגעים אם זו מחרוזת
            /*console.log(
              `ℹ️ Skipped allergy filtering for rec ${rec._id} (EN string)`
            );*/
          }
        }

        // טיפול ב-example.he
        if (rec.example?.he) {
          if (Array.isArray(rec.example.he)) {
            const { filtered, matches } = filterExamplesByAllergy(
              rec.example.he,
              allergyList
            );
            newRec.example.he = filtered;

            /*if (matches.length > 0) {
              console.log(
                `⚠️ Allergy match in recommendation ${rec._id} (HE array):`,
                matches
              );
            }*/
          } /*else {
            // לא נוגעים אם זו מחרוזת
            console.log(
              `ℹ️ Skipped allergy filtering for rec ${rec._id} (HE string)`
            );
          }*/
        }

        return newRec;
      });

      console.log("🧪 Final filtered examples:");
      recommendations.forEach((rec, i) => {
        console.log(
          `${i + 1}. ${
            Array.isArray(rec.example?.en)
              ? rec.example.en.join(", ")
              : rec.example?.en || "–"
          }`
        );
      });

      // STAGE 11: Present relevant recommendations
      interface RecommendationResponse {
        recommendations: typeof recommendations;
        answersByTag: Array<{
          tag: string[];
          response: string | string[];
          questionId: string;
          type: string;
        }>;
        professionalSupport: boolean;
        selectedTags: string[];
        allergyList: string[];
        recommendationTypesList: string[];
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
        recommendationTypesList, //recommendation types List
      };

      if (recommendationTypesList.length > 1) {
        const mainType = recommendationTypesList[0];
        const subTypes = recommendationTypesList.slice(1);

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
            (r) => r.diagnosis_type?.[lang] === mainType
          );
        }
      }

      console.log(
        "🔍 Stage 11 Complete: Final recommendations:",
        finalResponse.recommendations.length,
        "\n"
      );

      console.log("💾 Saving recommendations to DB...", finalResponse);

      // שמירה למסד לפני שליחה למשתמש
      await StudentRecommendationsModel.create({
        studentId,
        recommendations: finalResponse.recommendations,
        tagsUsed: finalResponse.selectedTags,
        allergyList: finalResponse.allergyList,
        diagnosisTypes: finalResponse.recommendationTypesList,
        professionalSupport: finalResponse.professionalSupport,
        mainDiagnosisType: finalResponse.mainType,
        subtypeDiagnosisTypes: finalResponse.subTypes || [],
      });

      // שליחת ההמלצות ל-frontend
      res.json(finalResponse);
    } catch (err) {
      console.error("❌ Error in recommendations controller:", err);
      next(err);
    }
  }
);

/**
 * GET /api/recommendations/:studentId/latest
 * Get the latest saved recommendations for a student
 */
router.get(
  "/recommendations/:studentId/latest",
  async (
    req: Request<{ studentId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { studentId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ error: "Invalid studentId" });
        return;
      }

      const latest = await StudentRecommendationsModel.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
      })
        .sort({ createdAt: -1 })
        .lean();

      if (!latest) {
        res.status(404).json({ message: "No saved recommendations found." });
        return;
      }

      res.json(latest);
    } catch (err) {
      console.error("❌ Error fetching latest saved recommendations:", err);
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
    console.log("📥 recommendations endpoint triggered");
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
