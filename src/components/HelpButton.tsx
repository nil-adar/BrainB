// components/HelpButton.tsx

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import HelpModal from "./HelpModal";

export type Language = "en" | "he";

export type HelpPage =
  | "login"
  | "register"
  | "resetPassword"
  | "viewRecommendations"
  | "teacherDashboard"
  | "createTask"
  | "teacherQuestionnaire"
  | "createAssessment"
  | "chatWithParent"
  | "parentDashboard"
  | "parentQuestionnaire"
  | "studentDashboard"
  | "completeTasks"
  | "studentQuestionnaire"
  | "profileSettings";

interface HelpButtonProps {
  page: HelpPage;
  language?: Language;
  className?: string;
  variant?: "icon" | "button" | "text";
}

const HelpButton: React.FC<HelpButtonProps> = ({
  page,
  language = "en",
  className = "",
  variant = "icon",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonContent = {
    icon: <HelpCircle size={24} />,
    button: (
      <>
        <HelpCircle size={20} />
        <span className="ml-2">{language === "he" ? "עזרה" : "Help"}</span>
      </>
    ),
    text: <span>{language === "he" ? "צריך עזרה?" : "Need Help?"}</span>,
  };

  const baseClasses = "transition-colors flex items-center";
  const variantClasses = {
    icon: "text-gray-500 hover:text-blue-500 p-2",
    button: "px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100",
    text: "text-blue-600 hover:text-blue-700 underline",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${className} p-3`}
        aria-label={language === "he" ? "עזרה" : "Help"}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
      >
        {buttonContent[variant]}
      </button>

      <HelpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        page={page}
        language={language}
      />
    </>
  );
};

export default HelpButton;
