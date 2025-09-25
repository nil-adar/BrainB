import React from "react";
import { translateDiagnosisType } from "@/utils/translateDiagnosisType";

interface RecommendationTypeSelectionModalProps {
  isOpen: boolean;
  mainType: string;
  subTypes: string[];
  language: "en" | "he";
  onSelectPreference: (preference: "main" | "both") => void;
}

const RecommendationTypeSelectionModal: React.FC<
  RecommendationTypeSelectionModalProps
> = ({ isOpen, mainType, subTypes, language, onSelectPreference }) => {
  if (!isOpen) return null;

  if (!mainType) {
    const errorTranslations = {
      en: {
        title: "Error Loading Recommendations",
        message:
          "Something is missing for the recommendations. Please try again later or contact support.",
        closeButton: "Close",
      },
      he: {
        title: "שגיאה בטעינת ההמלצות",
        message:
          "חסר משהו בשביל ההמלצות. אנא נסה שוב מאוחר יותר או פנה לתמיכה.",
        closeButton: "סגור",
      },
    };

    const errorT = errorTranslations[language];
    const isRTL = language === "he";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-4">
              {errorT.title}
            </h3>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {errorT.message}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
            >
              {errorT.closeButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!subTypes || subTypes.length === 0) {
    return null;
  }
  const translatedMainType = translateDiagnosisType(mainType, language);
  const translatedSubTypes = subTypes.map((type) =>
    translateDiagnosisType(type, language)
  );

  const translations = {
    en: {
      title: "Multiple Types Detected",
      message: `Your child's main diagnosis is ${translatedMainType}, but we also detected some traits of ${translatedSubTypes.join(
        ", "
      )}.`,
      showAll: "Show All Recommendations",
      showMain: "Show Only Main Type",
    },
    he: {
      title: "זוהו מספר סוגים",
      message: `האבחנה העיקרית של הילד/ה שלך היא ${translatedMainType}, אך זיהינו גם תכונות של ${translatedSubTypes.join(
        ", "
      )}.`,
      showAll: "הצג את כל ההמלצות",
      showMain: "הצג רק המלצות מהסוג העיקרי",
    },
  };

  const t = translations[language];
  const isRTL = language === "he";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t.title}</h3>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {t.message}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => onSelectPreference("both")}
              className="w-full py-3 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-800 transition-colors font-medium"
            >
              {t.showAll}
            </button>

            <button
              onClick={() => onSelectPreference("main")}
              className="w-full py-3 px-4 bg-teal-700 text-white rounded-md hover:bg-teal-900 transition-colors font-medium"
            >
              {t.showMain}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationTypeSelectionModal;
