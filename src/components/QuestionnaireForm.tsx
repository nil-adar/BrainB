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

  /*the current answers state, keyed by question.id */
  /*answers: Record<string, string | string[]>;*/
  answers: {
    questionId: string;
    response: string | string[];
    tag?: string;
    type?: string;
    text?: string;
  }[];

  /*called whenever any question’s value changes */
  onChange: (answer: {
    questionId: string;
    response: string | string[];
    tag?: string;
    type?: string;
    text?: string;
  }) => void;
  /**
   * נקרא כאשר המשתמש לוחץ "סיים"
   * @param answers אובייקט שבו המפתח הוא question.id והערך הוא מחרוזת או מערך
   */
  onSubmit: (
    answers: {
      questionId: string;
      response: string | string[];
      tag?: string;
      type?: string;
      text?: string;
    }[]
  ) => void;
}

export default function QuestionnaireForm({
  questionnaire,
  answers,
  onChange,
  onSubmit,
}: QuestionnaireFormProps) {
  const { language } = useSettings();
  const isRTL = language === "he";

  // Pagination state
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  //First, filter out question dependencies:
  const visibleQuestionsAll = questionnaire.questions.filter((q) => {
    /*If this question is Q2-18, return true only when Q2-17 was answered opt2*/
    if (q.id === "q2-18") {
      return answers.find((a) => a.questionId === "q2-17")?.response === "opt2";
    }
    // q2-20…q2-29 only if q2-19 === 'yes'
    const group = [
      "q2-20",
      "q2-21",
      "q2-22",
      "q2-23",
      "q2-24",
      "q2-25",
      "q2-26",
      "q2-27",
      "q2-28",
      "q2-29",
    ];
    if (group.includes(q.id)) {
      return answers.find((a) => a.questionId === "q2-19")?.response === "yes";
    }
    // all other questions always show
    return true;
  });

  const questionsPerPage = 2;
  const totalPages = Math.ceil(visibleQuestionsAll.length / questionsPerPage);
  const currentQuestions = visibleQuestionsAll.slice(
    currentPageIndex * questionsPerPage,
    (currentPageIndex + 1) * questionsPerPage
  );
  const progress = ((currentPageIndex + 1) / totalPages) * 100;

  const canProceed = currentQuestions.every((q) => {
    const v = answers.find((a) => a.questionId === q.id)?.response;
    return q.type === "multiple"
      ? Array.isArray(v) && v.length > 0
      : typeof v === "string" && v !== "";
  });

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((i) => i + 1);
    } else {
      onSubmit(answers);
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((i) => i - 1);
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

            {answers.map((ansObj, index) => {
              const question = questionnaire.questions.find(
                (q) => q.id === ansObj.questionId
              );
              return (
                <div key={ansObj.questionId || index} className="mb-2">
                  <p className="text-sm font-medium">
                    {question?.text[language]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Array.isArray(ansObj.response)
                      ? ansObj.response.join(", ")
                      : ansObj.response}
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
            {Math.round(progress)}% {language === "he" ? "הושלם" : "completed"}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-teal-300 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentQuestions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          answer={
            answers.find((a) => a.questionId === question.id)?.response ?? ""
          }
          onAnswer={(_, ans) => {
            const shouldAddAllergyTag =
              question.id === "q2-19" && (ans === "yes" || ans === "opt1");

            const updatedAnswer = {
              questionId: question.id,
              response: ans,
              tag: shouldAddAllergyTag ? "allergy" : question.tag,
              type: question.type,
              text: question.text[language],
            };

            onChange(updatedAnswer);
          }}
        />
      ))}

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
