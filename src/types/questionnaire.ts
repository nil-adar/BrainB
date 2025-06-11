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
  /**
   * Unique question identifier
   * מזהה השאלה
   */
  id: string;
  /**
   * Filtering or categorization tag(s)
   * תגיות לסינון או קטלוג
   */
  tag: string;
  /**
   * Question type: 'single' = single-choice, 'multiple' = multi-choice
   * סוג השאלה: 'single' = בחירה יחידה, 'multiple' = בחירה מרובה
   */
  type: 'single' | 'multiple';
  /**
   * Question text in Hebrew and English
   * טקסט השאלה בעברית ובאנגלית
   */
  text: {
    he: string;
    en: string;
  };
  /**
   * Available options for the question
   * רשימת אפשרויות השאלה
   */
  options: QuestionOption[];
}

/**
 * Questionnaire
 * הגדרת שאלון שלם
 * @property id - מזהה השאלון
 * @property title - כותרת השאלון (he/en)
 * @property questions - מערך השאלות בשאלון
 */
export interface Questionnaire {
  /**
   * Unique questionnaire identifier
   * מזהה השאלון
   */
  id: string;
  /**
   * Questionnaire title in Hebrew and English
   * כותרת השאלון בעברית ובאנגלית
   */
  title: {
    he: string;
    en: string;
  };
  /**
   * Array of questions in this questionnaire
   * מערך השאלות בשאלון
   */
  questions: Question[];
}

/**
 * QuestionnaireAnswer
 * ייצוג תשובה בודדת לשאלון
 * @property questionId - מזהה השאלה
 * @property questionTag - תגית השאלה
 * @property selectedOptions - אפשרויות שנבחרו
 */
export interface QuestionnaireAnswer {
  /**
   * ID of the answered question
   * מזהה השאלה בתשובה
   */
  questionId: string;
  /**
   * Tag of the question, used for filtering or categorization
   * תגית השאלה לצרכי סינון וקטלוג
   */
  questionTag: string;
  /**
   * Selected option values (for single: array of one string)
   * הערכים שנבחרו עבור אפשרויות השאלה
   */
  selectedOptions: string[];
}

/**
 * QuestionnaireResults
 * מבנה תוצאות השאלון לאחר השלמה
 * @property questionnaireId - מזהה השאלון
 * @property answers - מערך התשובות
 * @property completedAt - תאריך ושעת השלמת השאלון
 */
export interface QuestionnaireResults {
  /**
   * ID of the completed questionnaire
   * מזהה השאלון שהושלם
   */
  questionnaireId: string;
  /**
   * Array of user answers
   * מערך התשובות של המשתמש
   */
  answers: QuestionnaireAnswer[];
  /**
   * Timestamp of completion
   * תאריך ושעת השלמת השאלון
   */
  completedAt: Date;
}
