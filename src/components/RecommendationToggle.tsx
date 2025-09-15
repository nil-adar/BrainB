import React from "react";
import { translateDiagnosisType } from "@/utils/translateDiagnosisType";
import { ChevronDown } from "lucide-react";

interface RecommendationToggleProps {
  language: "en" | "he";
  mainType: string;
  subTypes: string[];
  currentSelection: "main" | "both";
  onSelectionChange?: (selection: "main" | "both") => void;
  readonly?: boolean;
}

const RecommendationToggle: React.FC<RecommendationToggleProps> = ({
  language,
  mainType,
  subTypes,
  currentSelection,
  onSelectionChange,
  readonly = false,
}) => {
  const translatedMainType = translateDiagnosisType(mainType, language);
  const translatedSubTypes = subTypes.map((type) =>
    translateDiagnosisType(type, language)
  );

  const translations = {
    en: {
      mainOnly: `${translatedMainType} Only`,
      both: `Both Types`,
      subtitle: `Main: ${translatedMainType}, Sub: ${translatedSubTypes.join(
        ", "
      )}`,
      currentlyShowing: "Currently Showing",
      changeNote: "To change preference, return to main recommendations screen",
      selectType: "Select Recommendation Type:",
    },
    he: {
      mainOnly: `${translatedMainType} בלבד`,
      both: `שני הסוגים`,
      subtitle: `עיקרי: ${translatedMainType}, משני: ${translatedSubTypes.join(
        ", "
      )}`,
      currentlyShowing: "מוצג כעת",
      changeNote: "לשינוי ההעדפה חזור למסך המלצות הראשי",
      selectType: "בחר סוג המלצות:",
    },
  };

  const t = translations[language];
  const isRTL = language === "he";

  const options = [
    { value: "main", label: t.mainOnly },
    { value: "both", label: t.both },
  ];

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 mb-2 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-center mb-2">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {readonly ? t.currentlyShowing : t.selectType}
        </h3>
        <p className="text-sm text-gray-600">{t.subtitle}</p>
      </div>

      {/* Dropdown Container */}
      <div className="flex justify-center">
        {readonly ? (
          // תצוגה פסיבית
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-2 py-1 shadow-sm border">
            <span className="text-sm font-medium text-gray-800">
              {currentSelection === "main" ? t.mainOnly : t.both}
            </span>
          </div>
        ) : (
          // Dropdown אינטראקטיבי
          <div className="relative">
            <select
              value={currentSelection}
              onChange={(e) =>
                onSelectionChange?.(e.target.value as "main" | "both")
              }
              className={`appearance-none bg-gradient-to-r from-blue-50 to-purple-100 rounded-lg px-2 py-2 pr-8 text-sm font-medium text-gray-800 shadow-sm hover:border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-100 min-w-[150px] ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute ${
                isRTL ? "left-2" : "right-2"
              } top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-800 pointer-events-none`}
            />
          </div>
        )}
      </div>

      {/* הודעה לתתי המסכים */}
      {readonly && (
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">{t.changeNote}</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationToggle;
