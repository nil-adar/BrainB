import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ActionButtonsProps {
  viewRecommendationsText: string;
  newAssessmentText: string;
  //myAssessmentsText: string;
  helpSupportText: string;
  studentFormText: string;
  onStartAssessment: () => void;
  onHelpSupportClick: () => void;
  onStudentFormClick: () => void;
  studentId: string;
}

const ActionButtons = ({
  viewRecommendationsText,
  newAssessmentText,
  //myAssessmentsText,
  helpSupportText,
  studentFormText,
  onStartAssessment,
  onHelpSupportClick,
  onStudentFormClick,
  studentId,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col items-center md:items-start gap-6 order-3 md:order-1">
      <Link
        to={`/recommendations?studentId=${studentId}`} //
        className="w-full max-w-[300px] py-4 px-12 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-yellow-300 hover:to-green-400 text-white shadow-md"
      >
        {viewRecommendationsText}
      </Link>

      <Button
        className="w-full max-w-[300px] py-6 px-4 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-yellow-300 hover:to-green-400 text-white shadow-md"
        onClick={onStartAssessment}
      >
        {newAssessmentText}
      </Button>

      <Button
        className="w-full max-w-[300px] py-6 px-4 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-yellow-300 hover:to-green-400 text-white shadow-md"
        onClick={onStudentFormClick}
      >
        {studentFormText}
      </Button>

      <Button
        className="w-full max-w-[300px] py-6 px-4 rounded-full text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-yellow-300 hover:to-green-400 text-white shadow-md"
        onClick={onHelpSupportClick}
      >
        {helpSupportText}
      </Button>
    </div>
  );
};

export default ActionButtons;
