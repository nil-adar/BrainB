export interface TranslatedField {
  he: string;
  en: string;
}

export interface TranslatedArrayField {
  he: string[];
  en: string[];
}

export interface Recommendation {
  _id?: string;
  type?: string;
  diagnosis_type: TranslatedArrayField | TranslatedField | string; // יכול להיות מערך או מחרוזת
  category?: string;
  catagory?: TranslatedField; // שגיאת כתיב בנתונים המקוריים
  difficulty_description?: TranslatedField | string;
  recommendation: TranslatedField | string;
  example: TranslatedArrayField | TranslatedField | string | string[];
  contribution: TranslatedField | string;
  tags?: string[];
}
