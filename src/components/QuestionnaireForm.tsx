import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "./QuestionCard";
import { Questionnaire } from "@/types/questionnaire";
import { useSettings } from "@/components/SettingsContext";

export interface QuestionnaireFormProps {
  /** כל המידע על השאלון (title, questions וכו') */
  questionnaire: Questionnaire;
  /**
   * נקרא כאשר המשתמש לוחץ "סיים"
   * @param answers אובייקט שבו המפתח הוא question.id והערך הוא מחרוזת או מערך
   */
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export default function QuestionnaireForm({
  questionnaire,
  onSubmit,
}: QuestionnaireFormProps) {
  const { language } = useSettings();
  const isRTL = language === "he";

  // Pagination state
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(questionnaire.questions.length / questionsPerPage);
  const currentQuestions = questionnaire.questions.slice(
    currentPageIndex * questionsPerPage,
    (currentPageIndex + 1) * questionsPerPage
  );
  const progress = ((currentPageIndex + 1) / totalPages) * 100;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const canProceed = currentQuestions.every(q => {
    const v = answers[q.id];
    return q.type === "multiple"
      ? Array.isArray(v) && v.length > 0
      : typeof v === "string" && v !== "";
  });

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(i => i + 1);
    } else {
      onSubmit(answers);
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(i => i - 1);
    }
  };

  if (isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">
            {language === "he"
              ? "השאלון הושלם בהצלחה!"
              : "Questionnaire completed successfully!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            {language === "he"
              ? "תודה על מילוי השאלון. התשובות שלך נשמרו."
              : "Thank you for completing the questionnaire. Your answers have been saved."}
          </p>
          <div
            className={`bg-muted p-4 rounded-lg ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <h3 className="font-semibold mb-2">
              {language === "he" ? "סיכום התשובות:" : "Answer Summary:"}
            </h3>
            {Object.entries(answers).map(([qid, ans]) => {
              const question = questionnaire.questions.find(q => q.id === qid);
              return (
                <div key={qid} className="mb-2">
                  <p className="text-sm font-medium">
                    {question?.text[language]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Array.isArray(ans) ? ans.join(", ") : ans}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-6">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-3">
          <span>
            {language === "he"
              ? `עמוד ${currentPageIndex + 1} מתוך ${totalPages}`
              : `Page ${currentPageIndex + 1} of ${totalPages}`}
          </span>
          <span>
            {Math.round(progress)}%{" "}
            {language === "he" ? "הושלם" : "completed"}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-teal-300 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-6">
        {currentQuestions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
        >
          {language === "he" ? "עמוד קודם" : "Previous"}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          {currentPageIndex < totalPages - 1
            ? language === "he"
              ? "עמוד הבא"
              : "Next"
            : language === "he"
            ? "סיים"
            : "Finish"}
        </Button>
      </div>
    </div>
  );
}
