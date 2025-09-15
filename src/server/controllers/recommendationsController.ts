/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import type { FlattenMaps } from "mongoose";
import { DiagnosticResultModel } from "../models/DiagnosticResult";
import {
  RecommendationModel,
  IRecommendation,
} from "../models/RecommendationModel";
import { FormModel } from "../models/FormModel";
import { allergyMapping } from "../../data/foodAllergyMapping";
import { filterExamplesByAllergy } from "../../utils/filterExamplesByAllergy";
import { StudentRecommendationsModel } from "../models/StudentRecommendations";
import { translateDiagnosisType } from "../../utils/translateDiagnosisType";

const checkIfRecalculationNeeded = async (
  studentId: string
): Promise<boolean> => {
  try {
    const existingRecs = await StudentRecommendationsModel.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
    }).sort({ createdAt: -1 });

    if (!existingRecs) {
      console.log("🔍 No existing recommendations - need calculation");
      return true;
    }

    // בדוק אם השאלונים השתנו מאז החישוב האחרון
    const lastCalculation = existingRecs.createdAt;

    const [studentForm, parentForm, teacherForm, diagResult] =
      await Promise.all([
        FormModel.findOne({
          studentId,
          role: "student",
          $or: [
            { createdAt: { $gt: lastCalculation } },
            { updatedAt: { $gt: lastCalculation } },
          ],
        }),
        FormModel.findOne({
          studentId,
          role: "parent",
          $or: [
            { createdAt: { $gt: lastCalculation } },
            { updatedAt: { $gt: lastCalculation } },
          ],
        }),
        FormModel.findOne({
          studentId,
          role: "teacher",
          $or: [
            { createdAt: { $gt: lastCalculation } },
            { updatedAt: { $gt: lastCalculation } },
          ],
        }),
        //  בדיקת אבחון חדש
        DiagnosticResultModel.findOne({
          studentId: new mongoose.Types.ObjectId(studentId),
          createdAt: { $gt: lastCalculation },
        }),
      ]);

    const hasNewData = !!(
      studentForm ||
      parentForm ||
      teacherForm ||
      diagResult
    );

    console.log("🔍 Recalculation check:", {
      needsRecalculation: hasNewData,
      hasNewForms: !!(studentForm || parentForm || teacherForm),
      hasNewDiagnosis: !!diagResult,
    });

    return hasNewData;
  } catch (error) {
    console.error("❌ Error checking recalculation need:", error);
    return true; // במקרה של שגיאה, חשב מחדש
  }
};

const saveOrUpdateRecommendations = async (studentId: string, data: any) => {
  return await StudentRecommendationsModel.findOneAndUpdate(
    { studentId: new mongoose.Types.ObjectId(studentId) },
    {
      studentId,
      recommendations: data.recommendations,
      tagsUsed: data.selectedTags,
      allergyList: data.allergyList,
      professionalSupport: data.professionalSupport,
      diagnosisTypes: data.recommendationTypesList,
      mainDiagnosisType: data.mainType || data.recommendationTypesList[0],
      subtypeDiagnosisTypes: data.subTypes || [],
      updatedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

type Diagnosable = {
  diagnosis_type?: Localized<string | string[]> | string | string[];
  tags?: string[];
} & any;

type RecLean = FlattenMaps<IRecommendation> & {
  _id: mongoose.Types.ObjectId | string;
  __v?: number;
};

// Constants from the pipeline documentation
const MIN_NO_ADHD_VAL = 0.7;
const MIN_INATT_VAL = 0.2;
const MIN_HYPER_VAL = 0.25;

console.log("🐛 recommendationsController mounted");

// Create an Express router to hold our endpoint
const router = express.Router();

// Type definitions
type Localized<T> = { en: T; he?: T };

type MongoRecommendation = RecLean & {
  category?: string | { en?: string; he?: string };
};

interface RecommendationDTO {
  _id?: mongoose.Types.ObjectId | string;
  diagnosis_type?: Localized<string[] | string> | string;
  tags: string[];
  example?: Localized<string[] | string>;
  recommendation?: Localized<string> | string;
  category?: string;
  type?: string;
  contribution?: Localized<string>;
  difficulty_description?: Localized<string>;
}

interface AnswerPair {
  questionId: string;
  response: string | string[];
  tag?: string[];
  type?: string;
}

interface RecommendationResponse {
  recommendations: RecommendationDTO[];
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
const normalizeRecommendation = (
  doc: MongoRecommendation,
  language: string = "en"
): RecommendationDTO => {
  const cat = doc.category as unknown;

  let flatCategory: string | undefined;

  if (typeof cat === "string") {
    flatCategory = cat;
  } else if (cat && typeof cat === "object") {
    // תמיד קח את השפה הנכונה תחילה
    const categoryObj = cat as any;
    if (language === "he") {
      flatCategory = categoryObj.he || categoryObj.en;
    } else {
      flatCategory = categoryObj.en || categoryObj.he;
    }
  }
  return {
    _id: doc._id,
    diagnosis_type: doc.diagnosis_type as Localized<string[] | string> | string,
    tags: doc.tags ?? [],
    example: doc.example as Localized<string[] | string> | undefined,
    recommendation: doc.recommendation as
      | Localized<string>
      | string
      | undefined,
    category: flatCategory,
    type: doc.type,
    contribution: doc.contribution as Localized<string> | undefined,
    difficulty_description: doc.difficulty_description as
      | Localized<string>
      | undefined,
  };
};

/**
 * GET /api/recommendations/:studentId
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
    console.log("📤 sending request to recommendations");
    console.log(
      "🚀 Entered /api/recommendations handler for",
      req.params.studentId
    );

    try {
      const lang = req.query.lang === "he" ? "he" : "en";
      const viewParam = req.query.view as "main" | "both" | undefined;
      // Validate and parse studentId
      const { studentId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ error: "Invalid studentId" });
        return;
      }

      console.log("🔍 Checking if recalculation needed...");
      console.log("🔍 View parameter:", viewParam);
      // בדוק אם יש המלצות קיימות
      const existingRecs = await StudentRecommendationsModel.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
      }).sort({ createdAt: -1 });

      if (existingRecs) {
        // בדוק אם השאלונים השתנו מאז
        const lastCalculation = existingRecs.createdAt;

        const [studentForm, parentForm, teacherForm] = await Promise.all([
          FormModel.findOne({
            studentId,
            role: "student",
            $or: [
              { createdAt: { $gt: lastCalculation } },
              { updatedAt: { $gt: lastCalculation } },
            ],
          }),
          FormModel.findOne({
            studentId,
            role: "parent",
            $or: [
              { createdAt: { $gt: lastCalculation } },
              { updatedAt: { $gt: lastCalculation } },
            ],
          }),
          FormModel.findOne({
            studentId,
            role: "teacher",
            $or: [
              { createdAt: { $gt: lastCalculation } },
              { updatedAt: { $gt: lastCalculation } },
            ],
          }),
        ]);

        const hasNewData = !!(studentForm || parentForm || teacherForm);

        if (!hasNewData) {
          console.log(
            "🎯 No changes detected - using existing recommendations"
          );

          // החל את הסינון גם על ההמלצות הקיימות
          let filteredRecommendations = existingRecs.recommendations || [];

          if (viewParam === "main" && existingRecs.diagnosisTypes?.length > 1) {
            const mainType = existingRecs.mainDiagnosisType;

            if (!mainType) {
              console.warn(
                "⚠️ Missing mainType for multi-type recommendation, using first from diagnosisTypes"
              );
              const fallbackMainType = existingRecs.diagnosisTypes[0];

              if (fallbackMainType) {
                console.log("🔍 Using fallback main type:", fallbackMainType);

                filteredRecommendations = filteredRecommendations.filter(
                  (rec: any) => {
                    // בדוק אם זו המלצה מיוחדת (טראומה/הערכה מקצועית)
                    const hasSpecialTag = (rec.tags || []).some((tag: string) =>
                      ["trauma_suspected", "professional_assessment"].includes(
                        tag
                      )
                    );

                    if (hasSpecialTag) {
                      return true; // תמיד כלול המלצות מיוחדות
                    }

                    // בדוק אם ההמלצה שייכת לסוג העיקרי
                    const diagnosisType = rec.diagnosis_type;
                    let diagnosisArray: string[] = [];

                    if (typeof diagnosisType === "string") {
                      diagnosisArray = [diagnosisType];
                    } else if (Array.isArray(diagnosisType)) {
                      diagnosisArray = diagnosisType;
                    } else if (diagnosisType?.en) {
                      diagnosisArray = Array.isArray(diagnosisType.en)
                        ? diagnosisType.en
                        : [diagnosisType.en];
                    }

                    const hasMainType = diagnosisArray.some((type: string) =>
                      type
                        .toLowerCase()
                        .includes(fallbackMainType.toLowerCase())
                    );

                    return hasMainType;
                  }
                );
              } else {
                console.error(
                  "❌ No valid diagnosis types found, skipping filtering"
                );
                // לא מסנן כלום אם אין נתונים תקינים
              }
            } else {
              console.log(
                "🔍 Filtering existing recommendations for main type:",
                mainType
              );

              filteredRecommendations = filteredRecommendations.filter(
                (rec: any) => {
                  // בדוק אם זו המלצה מיוחדת (טראומה/הערכה מקצועית)
                  const hasSpecialTag = (rec.tags || []).some((tag: string) =>
                    ["trauma_suspected", "professional_assessment"].includes(
                      tag
                    )
                  );

                  if (hasSpecialTag) {
                    return true; // תמיד כלול המלצות מיוחדות
                  }

                  // בדוק אם ההמלצה שייכת לסוג העיקרי
                  const diagnosisType = rec.diagnosis_type;
                  let diagnosisArray: string[] = [];

                  if (typeof diagnosisType === "string") {
                    diagnosisArray = [diagnosisType];
                  } else if (Array.isArray(diagnosisType)) {
                    diagnosisArray = diagnosisType;
                  } else if (diagnosisType?.en) {
                    diagnosisArray = Array.isArray(diagnosisType.en)
                      ? diagnosisType.en
                      : [diagnosisType.en];
                  }

                  const hasMainType = diagnosisArray.some((type: string) =>
                    type.toLowerCase().includes(mainType.toLowerCase())
                  );

                  return hasMainType;
                }
              );
            }

            console.log(
              `🔍 Filtered from ${existingRecs.recommendations.length} to ${filteredRecommendations.length} recommendations`
            );
          }

          const response = {
            recommendations: filteredRecommendations,
            answersByTag: [],
            professionalSupport: existingRecs.professionalSupport || false,
            selectedTags: existingRecs.tagsUsed || [],
            allergyList: existingRecs.allergyList || [],
            recommendationTypesList: existingRecs.diagnosisTypes || [],
            multipleTypes: existingRecs.diagnosisTypes?.length > 1,
            mainType: existingRecs.mainDiagnosisType,
            subTypes: existingRecs.subtypeDiagnosisTypes || [],
            source: "database",
          };

          res.json(response);
          return;
        } else {
          console.log("🔄 Changes detected - will recalculate");
        }
      } else {
        console.log("🔄 No existing recommendations - will calculate");
      }

      // Load the latest diagnosticResult document for this student
      const diag = await DiagnosticResultModel.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
      })
        .sort({ createdAt: -1 })
        .exec();

      if (!diag) {
        console.log("⚠️ Stage 1 – no diag for studentId:", studentId);
        res.status(404).json({ error: "No diagnostic data found" });
        return;
      }

      const [combined_pct, hyper_pct, inatt_pct, noAdhd_pct] = diag.percentages;

      console.log(
        "💡 Stage 1 – percentages breakdown:\n" +
          `  🟠 Combined:     ${combined_pct} \n` +
          `  🔵 Hyperactivity:  ${hyper_pct}\n` +
          `  🟡 Inattention:  ${inatt_pct}\n` +
          `  ⚪ No ADHD:      ${noAdhd_pct}\n`
      );

      // STAGE 1: Initial Screening Filter
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
      const allForms = [studentForm, parentForm, teacherForm].filter(Boolean);

      // Extract structured answers
      const allAnswers: AnswerPair[] = allForms.flatMap((form) => {
        if (!form?.answers) return [];

        interface RawSavedAnswer {
          response?: string | string[];
          tag?: string | string[];
          type?: string;
        }

        return Object.entries(form.answers).flatMap(([qid, obj]) => {
          const a = obj as RawSavedAnswer;
          return {
            questionId: qid,
            response: a.response ?? "",
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
        type: a.type || "",
      }));

      const selectedTags: string[] = [];
      let allergyList: string[] = [];

      console.log("🏷️ Answers mapped to tags:", {
        totalMapped: answersByTag.length,
        tagsFound: answersByTag.filter((a) => a.tag).length,
      });

      // STAGE 2-6: Classification Logic (מתוקן)
      let recommendationTypesList: string[] = [];
      const flags: Set<string> = new Set();

      // STAGE 2: Combined vs. Subtype Differentiation
      if (Math.max(hyper_pct, inatt_pct, combined_pct) === combined_pct) {
        console.log("🔍 Stage 2: Combined type detected");
        recommendationTypesList.push("Combined");
      } else {
        // STAGE 3: Subtype Pathway Selection
        const dominantFromPercentages =
          hyper_pct >= inatt_pct ? "Hyperactivity" : "Inattention";
        console.log(
          "🔍 Stage 3: Dominant from percentages:",
          dominantFromPercentages
        );

        // הגדרת דגלים ראשוניים לפי הספים
        if (dominantFromPercentages === "Hyperactivity") {
          if (inatt_pct < MIN_INATT_VAL) {
            flags.add("Hyperactivity"); // רק כשאין Inattention מספיק
          }
          // אחרת לא נוסיף Hyperactivity כלל בשלב זה
        } else {
          flags.add("Inattention"); // תמיד בנתיב Inattention
        }

        if (dominantFromPercentages === "Hyperactivity") {
          // Hyperactivity dominant path
          if (inatt_pct >= MIN_INATT_VAL) {
            flags.add("Inattention"); // רק Inattention נוסף, לא Hyperactivity!
          }
          // אחרת flags נשאר עם Hyperactivity (שנוסף למעלה)
        }
        // בנתיב Inattention, flags כבר מכיל רק ["Inattention"]

        // STAGE 4 & 5: Parent Questionnaire Processing
        const subtypeAnswer = answersByTag.find(
          (x) => x.tag?.includes("subtype") || x.questionId.includes("q2-16")
        )?.response as string | undefined;

        let parentDefinedMainType: string | null = null;

        if (subtypeAnswer) {
          console.log("🔍 Stage 5: Parent subtype answer:", subtypeAnswer);

          if (dominantFromPercentages === "Hyperactivity") {
            // Hyperactivity dominant path
            switch (subtypeAnswer) {
              case "opt1": // Hyperactivity
                flags.add("Hyperactivity");
                break;
              case "opt2": // Impulsivity
                flags.add("Impulsivity");
                parentDefinedMainType = "Impulsivity";
                console.log(
                  "🔍 Stage 5: Parent defined mainType as Impulsivity (Hyperactivity path)"
                );
                break;
              case "opt3": // Both
                flags.add("Hyperactivity");
                flags.add("Impulsivity");
                break;
              case "opt4": // None
                break;
            }
          } else {
            // Inattention dominant path - רק אם hyper_pct >= MIN_HYPER_VAL
            if (hyper_pct >= MIN_HYPER_VAL) {
              switch (subtypeAnswer) {
                case "opt1": // Hyperactivity
                  flags.add("Hyperactivity");
                  console.log(
                    "🔍 Stage 5: Added Hyperactivity (Inattention path)"
                  );
                  break;
                case "opt2": // Impulsivity
                  flags.add("Impulsivity");
                  console.log(
                    "🔍 Stage 5: Added Impulsivity (Inattention path)"
                  );
                  break;
                case "opt3": // Both
                  flags.add("Hyperactivity");
                  flags.add("Impulsivity");
                  console.log(
                    "🔍 Stage 5: Added both Hyperactivity and Impulsivity (Inattention path)"
                  );
                  break;
                case "opt4": // None
                  console.log(
                    "🔍 Stage 5: Parent chose none (Inattention path)"
                  );
                  break;
              }
            } else {
              console.log(
                "🔍 Stage 5: hyper_pct below threshold, ignoring parent subtype choice"
              );
            }
          }
        }

        // STAGE 6: Multi-Flag Consolidation Logic
        const flagArray = Array.from(flags);
        console.log("🔍 Stage 6: Active flags:", flagArray);
        console.log(
          "🔍 Stage 6: Dominant from percentages:",
          dominantFromPercentages
        );

        // בדיקה מוקדמת של 3 דגלים
        const hasHyper = flags.has("Hyperactivity");
        const hasImpuls = flags.has("Impulsivity");
        const hasInatt = flags.has("Inattention");

        // אם יש 3 דגלים פעילים - זה Combined חובה
        if (hasHyper && hasImpuls && hasInatt) {
          console.log("🔍 Stage 6: 3 flags detected - forcing Combined type");
          recommendationTypesList = ["Combined"];
        } else if (flagArray.length === 1) {
          recommendationTypesList = flagArray;
        } else if (flagArray.length > 1) {
          // קביעת סדר עדיפויות לכמה flags
          let mainType: string;

          if (parentDefinedMainType) {
            // אם ההורה הגדיר mainType ספציפי (כמו Impulsivity), הוא מקבל עדיפות
            mainType = parentDefinedMainType;
            console.log("🔍 Stage 6: Using parent-defined mainType:", mainType);
          } else {
            // אחרת, נשתמש בדומיננטי מהאחוזים (Hyperactivity או Inattention)
            mainType = dominantFromPercentages;
            console.log(
              "🔍 Stage 6: Using percentage-based mainType:",
              mainType
            );
          }

          // בניית רשימת הסוגים עם mainType ראשון
          recommendationTypesList = [
            mainType,
            ...flagArray.filter((type) => type !== mainType),
          ];

          console.log(
            "🔍 Stage 6: Final ordered recommendation types:",
            recommendationTypesList
          );
        } else {
          // No flags - use dominant from percentages
          recommendationTypesList = [dominantFromPercentages];
        }
      }

      console.log(
        "🔍 Stage 6 Complete: Final recommendation list:",
        recommendationTypesList
      );

      // STAGE 7: Environmental Onset Screening
      let professionalSupport = false;

      const alwaysPresentAnswer = answersByTag.find((x) =>
        x.questionId.includes("q2-27")
      )?.response as string | undefined;

      if (alwaysPresentAnswer === "opt2") {
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
      let mongoRecommendations = await RecommendationModel.find({
        "diagnosis_type.en": { $in: recommendationTypesList },
      })
        .lean<RecLean[]>() // Add array type annotation
        .exec();

      answersByTag.forEach(({ tag, response, type, questionId }) => {
        if (type === "single" && (response === "opt3" || response === "opt4")) {
          if (Array.isArray(tag)) {
            selectedTags.push(...tag);
          } else if (tag) {
            selectedTags.push(tag);
          }
        }

        // לוגיקה מיוחדת לשאלת הטראומה q2-17
        if (
          questionId.includes("q2-17") &&
          (response === "opt2" || response === "opt3")
        ) {
          if (Array.isArray(tag)) {
            selectedTags.push(...tag);
          } else if (tag) {
            selectedTags.push(tag);
          }
          console.log("🔍 Trauma suspected based on q2-17 answer:", response);
        }

        // לוגיקה מיוחדת לשאלת האירוע q2-18
        if (
          questionId.includes("q2-18") &&
          ["opt2", "opt3", "opt4"].includes(response as string)
        ) {
          if (Array.isArray(tag)) {
            selectedTags.push(...tag);
          } else if (tag) {
            selectedTags.push(tag);
          }
          console.log(
            "🔍 Professional assessment flagged based on q2-18 answer:",
            response
          );
        }

        // q2-19 === yes/opt1 → add 'allergy'
        if (
          questionId.includes("q2-19") &&
          (response === "yes" || response === "opt1")
        ) {
          selectedTags.push("allergy");
        }

        // MULTIPLE questions with allergy tag → convert to allergyList
        if (
          type === "multiple" &&
          Array.isArray(tag) &&
          tag.includes("allergy")
        ) {
          const values = Array.isArray(response) ? response : [response];
          for (const code of values) {
            const mapped = allergyMapping[code as keyof typeof allergyMapping];
            if (mapped) {
              allergyList.push(mapped.en);
            }
          }
        }
      });

      allergyList = Array.from(new Set(allergyList));
      console.log("🏷️ Stage 9 selectedTags:", selectedTags);

      // בדיקה מיוחדת להמלצות טראומה
      // בדיקה מיוחדת להמלצות טראומה והערכה מקצועית
      const hasTraumaTag = selectedTags.includes("trauma_suspected");
      const hasProfessionalAssessmentTag = selectedTags.includes(
        "professional_assessment"
      );
      const needsSpecialRecommendations =
        hasTraumaTag || hasProfessionalAssessmentTag;

      console.log("🔍 Trauma tag detected:", hasTraumaTag);
      console.log(
        "🔍 Professional assessment tag detected:",
        hasProfessionalAssessmentTag
      );
      console.log(
        "🔍 Needs special recommendations:",
        needsSpecialRecommendations
      );

      // שמירת המלצות מיוחדות לפני סינון (ללא תלות ב-diagnosis_type!)
      const specialRecommendations = needsSpecialRecommendations
        ? await RecommendationModel.find({
            tags: { $in: ["trauma_suspected", "professional_assessment"] },
          })
            .lean<RecLean[]>()
            .exec()
        : [];

      console.log(
        "🔍 Found special recommendations:",
        specialRecommendations.length
      );

      // STAGE 9: Filter by tags from saved questionnaire forms
      if (selectedTags.length > 0) {
        mongoRecommendations = mongoRecommendations.filter((r) =>
          r.tags.some((tag) => selectedTags.includes(tag))
        );
        console.log(
          "🔍 Stage 9: STAGE 9 COMPLETE, Recommendations after saved-tag filter:",
          mongoRecommendations.length,
          "\n"
        );
      }

      // הוספת המלצות מיוחדות בחזרה אחרי הסינון (לא יכולות ליפול!)
      if (needsSpecialRecommendations && specialRecommendations.length > 0) {
        const existingIds = new Set(
          mongoRecommendations.map((r) => r._id.toString())
        );
        const uniqueSpecialRecs = specialRecommendations.filter(
          (r) => !existingIds.has(r._id.toString())
        );

        console.log("🔍 DEBUG: Adding special recommendations:");
        uniqueSpecialRecs.forEach((rec) => {
          console.log(
            `   - ID: ${rec._id}, tags: [${(rec.tags || []).join(
              ", "
            )}], diagnosis_type: ${JSON.stringify(rec.diagnosis_type)}`
          );
        });

        mongoRecommendations = [...uniqueSpecialRecs, ...mongoRecommendations];

        console.log(
          "🔍 Added special recommendations at top. Total:",
          mongoRecommendations.length
        );
      }

      // שמור את ה-diagnosis_type המקורי לפני התרגום לצורך סינון (אחרי הוספת המלצות מיוחדות!)
      const originalRecommendations = mongoRecommendations.map((rec) => ({
        ...rec,
        originalDiagnosisType: rec.diagnosis_type,
      }));

      // 1. Add comprehensive logging after Stage 9 (tag filtering)
      console.log(
        `📊 Total recommendations after tag filter: ${mongoRecommendations.length}`
      );

      // STAGE 10: Filtering by allergies
      console.log("🧪 Stage 10 – Allergy items to filter out:", allergyList);
      const applyAllergyFilter = (rec: RecLean): RecLean => {
        const next: RecLean = { ...rec };
        if (Array.isArray(next.example?.en)) {
          const { filtered } = filterExamplesByAllergy(
            next.example.en,
            allergyList
          );
          next.example.en = filtered;
        }
        if (Array.isArray(next.example?.he)) {
          const { filtered } = filterExamplesByAllergy(
            next.example.he,
            allergyList
          );
          next.example.he = filtered;
        }
        return next;
      };

      mongoRecommendations = mongoRecommendations.map(applyAllergyFilter);

      const normalize = (s?: string) => (s ?? "").trim().toLowerCase();

      type Diagnosable =
        | { diagnosis_type?: Localized<string | string[]> | string | string[] }
        | any;

      const getDxArray = (r: Diagnosable): string[] => {
        const raw =
          typeof r?.diagnosis_type === "string" ||
          Array.isArray(r?.diagnosis_type)
            ? r.diagnosis_type
            : r?.diagnosis_type?.en;

        const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
        return arr.map(normalize);
      };

      const hasDx = (r: Diagnosable, type: string) =>
        getDxArray(r).includes(normalize(type));

      // פונקציה שבודקת גם את המקורי (לסינון)
      const hasDxOriginal = (r: any, type: string): boolean => {
        const raw = r.originalDiagnosisType?.en || r.originalDiagnosisType;
        const arr = Array.isArray(raw) ? raw : raw ? [raw] : [];
        return arr.map(normalize).includes(normalize(type));
      };

      if (lang === "he") {
        mongoRecommendations.forEach((rec) => {
          if (Array.isArray(rec.diagnosis_type)) {
            (rec as any).diagnosis_type = rec.diagnosis_type.map(
              (type: string) => translateDiagnosisType(type, "he")
            );
          } else if (typeof rec.diagnosis_type === "string") {
            (rec as any).diagnosis_type = translateDiagnosisType(
              rec.diagnosis_type,
              "he"
            );
          }
        });
      }
      // Normalize recommendations for frontend
      const normalizedRecommendations: RecommendationDTO[] =
        mongoRecommendations.map((doc) => normalizeRecommendation(doc, lang));

      // STAGE 11: Present relevant recommendations
      const finalResponse: RecommendationResponse = {
        recommendations: normalizedRecommendations,
        answersByTag,
        professionalSupport,
        selectedTags,
        allergyList,
        recommendationTypesList,
      };

      // 2. Enhanced Stage 11 debugging with view parameter analysis
      console.log(
        "🔍 STAGE 11 - Multiple Types Analysis, recommendationTypesList:",
        recommendationTypesList
      );
      console.log(
        "recommendationTypesList.length:",
        recommendationTypesList.length
      );

      console.log(
        `🔍 Final recommendations count: ${finalResponse.recommendations.length}`
      );
      console.log(
        "🔍 Final recommendations IDs:",
        finalResponse.recommendations.map((r) => r._id)
      );

      // Check the view parameter more carefully
      const viewFromQuery = req.query.view;
      const viewBothFromQuery = req.query.viewBoth;
      console.log("🔍 Query Parameters:", {
        viewFromQuery,
        viewBothFromQuery,
        queryKeys: Object.keys(req.query),
      });

      if (recommendationTypesList.length > 1) {
        const mainType = recommendationTypesList[0];
        const subTypes = recommendationTypesList.slice(1);

        finalResponse.multipleTypes = true;
        finalResponse.mainType = mainType;
        finalResponse.subTypes = subTypes;
        finalResponse.message = `Your child's main diagnosis is ${mainType}, but we also detected some traits of ${subTypes.join(
          ", "
        )}.`;

        console.log(
          "🔍 Stage 11 mainType, subTypes:",
          finalResponse.message,
          "\n"
        );

        // Check if user wants both types or just main
        const viewParam = (() => {
          if (
            typeof req.query.view === "string" &&
            (req.query.view === "main" || req.query.view === "both")
          ) {
            return req.query.view;
          }
          if (req.query.viewBoth === "true") {
            return "both";
          }
          return "both";
        })();

        console.log("🔍 Determined viewParam:", viewParam);

        // Filter recommendations if user wants only main type
        finalResponse.recommendations =
          viewParam === "main"
            ? normalizedRecommendations.filter((r, index) => {
                const originalRec = originalRecommendations[index];
                const hasMainDx = hasDxOriginal(originalRec, mainType);
                const hasSpecialTag = (originalRec.tags || []).some((tag) =>
                  ["trauma_suspected", "professional_assessment"].includes(tag)
                );

                console.log(`🔍 Checking recommendation ${originalRec._id}:`);
                console.log(
                  `   - Tags: [${(originalRec.tags || []).join(", ")}]`
                );
                console.log(`   - Has special tag: ${hasSpecialTag}`);
                console.log(
                  `   - diagnosis_type: ${JSON.stringify(
                    originalRec.originalDiagnosisType ||
                      originalRec.diagnosis_type
                  )}`
                );
                console.log(`   - Has main type "${mainType}": ${hasMainDx}`);
                console.log(`   - Will keep: ${hasSpecialTag || hasMainDx}`);

                return hasSpecialTag || hasMainDx;
              })
            : normalizedRecommendations;
      }

      // Translate diagnosis types
      const dominantType =
        finalResponse.mainType || finalResponse.recommendationTypesList[0];
      const dominantDiagnosisType = {
        en: dominantType,
        he: translateDiagnosisType(dominantType, "he"),
      };

      const firstSub =
        Array.isArray(finalResponse.subTypes) &&
        finalResponse.subTypes.length > 0
          ? finalResponse.subTypes[0]
          : undefined;

      const subtypeDiagnosisType = firstSub
        ? { en: firstSub, he: translateDiagnosisType(firstSub, "he") }
        : undefined;

      // Save to database (upsert instead of create)
      await StudentRecommendationsModel.findOneAndUpdate(
        { studentId: new mongoose.Types.ObjectId(studentId) },
        {
          studentId,
          recommendations: finalResponse.recommendations,
          tagsUsed: finalResponse.selectedTags,
          allergyList: finalResponse.allergyList,
          professionalSupport: finalResponse.professionalSupport,
          diagnosisTypes: recommendationTypesList,
          mainDiagnosisType: dominantType,
          subtypeDiagnosisTypes: finalResponse.subTypes || [],
          dominantDiagnosisType,
          subtypeDiagnosisType,
          updatedAt: new Date(),
        },
        {
          upsert: true, // יצירה אם לא קיים, עדכון אם כן
          new: true, // החזר את המסמך המעודכן
          setDefaultsOnInsert: true,
        }
      );

      // Send recommendations to frontend
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

      const maxPercentage = Math.max(
        combined_pct,
        hyper_pct,
        inatt_pct,
        noAdhd_pct
      );
      const isNoAdhdMax = maxPercentage === noAdhd_pct;

      const debugInfo = {
        stage1_screening: {
          percentages: { combined_pct, hyper_pct, inatt_pct, noAdhd_pct },
          maxPercentage,
          ...(isNoAdhdMax
            ? {
                noAdhdThresholdMet: noAdhd_pct >= MIN_NO_ADHD_VAL,
                shouldTerminate: noAdhd_pct >= MIN_NO_ADHD_VAL,
              }
            : {}),
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
