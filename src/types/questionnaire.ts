/**
 * Defines the core types for questionnaires, questions, and answers used throughout the application.
 */

/**
 * QuestionOption
 * נקודת אפשרות לשאלה (בחירה יחידה או מרובות)
 * @property id - מזהה ייחודי לאפשרות
 * @property text - טקסט דו-לשוני (he/en)
 */
export interface QuestionOption {
  /**
   * Unique identifier for the option
   * מזהה ייחודי לאפשרות
   */
  id: string;
  /**
   * Option label in Hebrew and English
   * תווית האפשרות בעברית ובאנגלית
   */
  text: {
    he: string;
    en: string;
  };
}

/**
 * Question
 * מבנה של שאלה בשאלון
 * @property id - מזהה השאלה
 * @property tag - תגיות לסינון ועיבוד
 * @property type - סוג השאלה: בחירה יחידה או מרובות
 * @property text - הטקסט של השאלה (he/en)
 * @property options - רשימת אפשרויות השאלה
 */
export interface Question {
  id: string; //Unique question identifier
  tag: string; //Filtering or categorization tag(s)
  type: "single" | "multiple"; //Question type: 'single' = single-choice, 'multiple' = multi-choice
  text: {
    // Question text in Hebrew and English
    he: string;
    en: string;
  };
  // Available options for the question
  options: QuestionOption[];
}

/**
 * Questionnaire
 * @property id - מזהה השאלון
 * @property title - כותרת השאלון (he/en)
 * @property questions - מערך השאלות בשאלון
 */
export interface Questionnaire {
  id: string;
  title: {
    he: string;
    en: string;
  };
  questions: Question[];
}

/**
 * QuestionnaireAnswer
 * @property questionId - מזהה השאלה
 * @property questionTag - תגית השאלה
 * @property selectedOptions - אפשרויות שנבחרו
 */
export interface QuestionnaireAnswer {
  /**
   * ID of the answered question
   */
  questionId: string;
  /**
   * Tag of the question, used for filtering or categorization
   */
  questionTag: string;
  /**
   * Selected option values (for single: array of one string)
   */
  selectedOptions: string[];
}

/**
 * QuestionnaireResults
 * @property questionnaireId - מזהה השאלון
 * @property answers - מערך התשובות
 * @property completedAt - תאריך ושעת השלמת השאלון
 */
export interface QuestionnaireResults {
  /**
   * ID of the completed questionnaire
   */
  questionnaireId: string;
  /**
   * Array of user answers
   */
  answers: QuestionnaireAnswer[];
  /**
   * Timestamp of completion
   */
  completedAt: Date;
}
