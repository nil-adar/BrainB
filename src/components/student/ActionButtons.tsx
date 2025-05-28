import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ActionButtonsProps {
  viewRecommendationsText: string;
  newAssessmentText: string;
  myAssessmentsText: string;
  helpSupportText: string;
  studentFormText: string;
  onStartAssessment: () => void;
  onHelpSupportClick: () => void;
  onStudentFormClick: () => void;
}

const ActionButtons = ({
  viewRecommendationsText,
  newAssessmentText,
  myAssessmentsText,
  helpSupportText,
  studentFormText,
  onStartAssessment,
  onHelpSupportClick,
  onStudentFormClick,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col items-center md:items-start gap-3 order-3 md:order-1">

      <Link
        to="/recommendations"
        className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 dark:from-blue-900 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-700 text-blue-700 dark:text-blue-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm"
      >
        {viewRecommendationsText}
      </Link>

      <Button
        className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md"
        onClick={onStartAssessment}
      >
        {newAssessmentText}
      </Button>

      <Button
        className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 dark:from-indigo-900 dark:to-indigo-800 dark:hover:from-indigo-800 dark:hover:to-indigo-700 text-indigo-700 dark:text-indigo-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm"
        onClick={onStudentFormClick}
      >
        {studentFormText}
      </Button>

      <Link
        to="/my-assessments"
        className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 dark:from-green-900 dark:to-green-800 dark:hover:from-green-800 dark:hover:to-green-700 text-green-700 dark:text-green-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm"
      >
        {myAssessmentsText}
      </Link>

      <Button
        className="w-full max-w-[200px] py-2 px-4 rounded-full text-sm bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 dark:from-amber-900 dark:to-amber-800 dark:hover:from-amber-800 dark:hover:to-amber-700 text-amber-700 dark:text-amber-200 transition-all duration-300 shadow-sm text-center backdrop-blur-sm"
        onClick={onHelpSupportClick}
      >
        {helpSupportText}
      </Button>

    </div>
  );
};

export default ActionButtons;
