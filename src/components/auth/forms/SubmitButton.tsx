
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
  isRTL: boolean;
}

export const SubmitButton = ({
  isLoading,
  text,
  loadingText,
  isRTL,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full flex items-center justify-center gap-2 ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
      disabled={isLoading}
    >
      <span>{isLoading ? loadingText : text}</span>
      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
    </Button>
  );
};
