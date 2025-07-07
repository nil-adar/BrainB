export interface TranslatedField {
  he: string;
  en: string;
}

export interface Recommendation {
  diagnosis_type: TranslatedField;
  category: TranslatedField;
  difficulty_description: TranslatedField;
  recommendation: TranslatedField;
  example: TranslatedField;
  contribution: TranslatedField;
  difficulty_tags: string[];
}
