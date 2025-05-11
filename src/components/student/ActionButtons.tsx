
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpSupportDialog } from "./HelpSupportDialog";
import { mockTeachers } from "@/services/mock/teachers";
import { Teacher } from "@/types/school";

interface ActionButtonsProps {
  viewRecommendations: string;
  newAssessment: string;
  myAssessments: string;
  helpSupport: string;
  onStartAssessment: () => void;
}

export const ActionButtons = ({
  viewRecommendations,
  newAssessment,
  myAssessments,
  helpSupport,
  onStartAssessment
}: ActionButtonsProps) => {
  const navigate = useNavigate();
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // In a real app, this would come from the logged-in user's data
  const assignedTeacher: Teacher = mockTeachers[0];

  return (
    <>
      <div className="space-y-2">
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={() => navigate('/recommendations')}
        >
          {viewRecommendations}
        </Button>
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={onStartAssessment}
        >
          {newAssessment}
        </Button>
        <Button className="w-full" variant="secondary">
          {myAssessments}
        </Button>
        <Button 
          className="w-full" 
          variant="secondary"
          onClick={() => setShowHelpDialog(true)}
        >
          {helpSupport}
        </Button>
      </div>

      <HelpSupportDialog
        open={showHelpDialog}
        onOpenChange={setShowHelpDialog}
        assignedTeacher={assignedTeacher}
      />
    </>
  );
};
