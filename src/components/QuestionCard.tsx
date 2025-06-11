/**
 * QuestionCard.tsx
 *
 * This component displays a single question card with support for both single-choice and multiple-choice questions.
 * It renders options as RadioGroupItems or Checkboxes, labels in Hebrew/English, and shows the question tag if provided.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/questionnaire";
import { useSettings } from "@/components/SettingsContext";

/**
 * Props for QuestionCard:
 * @param question - The question object, including text, type, options, and optional tag
 * @param answer - Current answer(s) for this question (string or array of strings)
 * @param onAnswer - Callback invoked when the answer changes
 */
interface QuestionCardProps {
  question: Question;
  answer: string | string[] | undefined;
  onAnswer: (questionId: string, answer: string | string[]) => void;
}

/**
 * QuestionCard component
 * רִיאקט פרוגרסיבי המציג שאלה אחת עם אפשרויות בחירה יחידה או מרובות
 */
const QuestionCard = ({ question, answer, onAnswer }: QuestionCardProps) => {
  // Retrieve current language ('he'|'en') from context
  const { language } = useSettings();

  /**
   * Handle single-choice selection
   * מעדכן תשובה יחידה
   */
  const handleSingleChoice = (value: string) => {
    onAnswer(question.id, value);
  };

  /**
   * Handle multiple-choice toggles
   * מוסיף/מסיר ערך ממערך התשובות
   */
  const handleMultipleChoice = (optionValue: string, checked: boolean) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    const newAnswers = checked
      ? [...currentAnswers, optionValue]
      : currentAnswers.filter(a => a !== optionValue);
    onAnswer(question.id, newAnswers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-lg ${language === 'he' ? 'text-right' : 'text-left'}`}>
          {/* Render question text in selected language */}
          {question.text[language]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.type === "single" ? (
          // Single-choice UI
          <RadioGroup
            value={typeof answer === 'string' ? answer : ''}
            onValueChange={handleSingleChoice}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
                <RadioGroupItem
                  value={option.text[language]}
                  id={`${question.id}-${index}`}
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className={`flex-1 cursor-pointer ${language === 'he' ? 'text-right' : 'text-left'}`}>
                  {option.text[language]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          // Multiple-choice UI
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isChecked = Array.isArray(answer) && answer.includes(option.text[language]);
              return (
                <div
                  key={index}
                  className={`items-center ${language === 'he' ? 'flex-row-reverse' : ''}`}>
                  <Checkbox
                    id={`${question.id}-${index}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleMultipleChoice(option.text[language], checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`${question.id}-${index}`}
                    className={`flex-1 cursor-pointer ${language === 'he' ? 'text-right' : 'text-left'}`}>
                    {option.text[language]}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {/* If tag exists, render it below */}
        {question.tag && (
          <div className="mt-4 pt-4 border-t">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
              {question.tag}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
