import express, { Request, Response } from "express";
import { DiagnosticResultModel } from "../models/DiagnosticResult";
import { RecommendationModel } from "../models/Recommendation";
import {
  ParentAnswerModel,
  TeacherAnswerModel,
  ChildAnswerModel
} from "../models/Answers";
import { filterByTags } from '../../utils/filteringHelpers';
// שימי לב: אם הפונקציה הזו לא קיימת – תורידי או תכתבי dummy
// import { filterExamples } from "../utils/filteringHelpers";

const router = express.Router();//sandra

router.get('/recommendations/:studentId', async (req: express.Request, res: express.Response) => {
  const { studentId } = req.params;

  try {
    // שלב 1 – אבחון נודוס
    const diagnostic = await DiagnosticResultModel.findOne({ studentId }).sort({ createdAt: -1 });
    if (!diagnostic) return res.status(404).json({ message: 'No diagnostic results found' });

    const subtype = diagnostic.dominantSubtype;

    // שלב 2 – סינון לפי diagnosis_type
    const initialRecommendations = await RecommendationModel.find({ "diagnosis_type.en": subtype });

    // שלב 3 – שליפת תשובות מהשאלונים
    const [parentAnswers, teacherAnswers, childAnswers] = await Promise.all([
      ParentAnswerModel.findOne({ studentId }),
      TeacherAnswerModel.findOne({ studentId }),
      ChildAnswerModel.findOne({ studentId }),
    ]);

    const filteredByTags = filterByTags(initialRecommendations, parentAnswers, teacherAnswers, childAnswers);

    // שלב 4 – סינון לפי example (אם יש פונקציה)
    // const fullyFiltered = filterExamples(filteredByTags, parentAnswers, teacherAnswers, childAnswers);

    res.json({ recommendations: filteredByTags });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
