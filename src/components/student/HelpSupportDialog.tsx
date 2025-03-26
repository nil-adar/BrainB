
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { Teacher } from "@/types/school";
import { toast } from "@/hooks/use-toast";

interface HelpSupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignedTeacher: Teacher;
}

export const HelpSupportDialog = ({
  open,
  onOpenChange,
  assignedTeacher,
}: HelpSupportDialogProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    toast({
      title: "ההודעה נשלחה",
      description: `ההודעה נשלחה ל${assignedTeacher.name}`,
    });
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>עזרה ותמיכה</DialogTitle>
          <DialogDescription>
            ניתן ליצור קשר עם {assignedTeacher.name} במספר דרכים
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.location.href = `mailto:${assignedTeacher.email}`}
            >
              <Mail className="w-4 h-4" />
              שלח אימייל
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.location.href = `tel:${assignedTeacher.phone}`}
            >
              <Phone className="w-4 h-4" />
              התקשר
            </Button>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              או שלח/י הודעה ישירה:
            </label>
            <Textarea
              id="message"
              placeholder="כתוב/י את ההודעה כאן..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            שלח הודעה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
