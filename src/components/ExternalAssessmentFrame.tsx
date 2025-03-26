
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

interface ExternalAssessmentFrameProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const ExternalAssessmentFrame: React.FC<ExternalAssessmentFrameProps> = ({
  open,
  onClose,
  url
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
    }
  }, [open, url]);

  const handleIframeLoad = () => {
    setLoading(false);
    toast({
      title: "האבחון נטען בהצלחה",
      description: "מערכת האבחון החיצונית נטענה בהצלחה",
    });
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('לא ניתן לטעון את מערכת האבחון החיצונית. אנא נסה שוב מאוחר יותר.');
    toast({
      title: "שגיאה בטעינת האבחון",
      description: "אירעה שגיאה בטעינת מערכת האבחון החיצונית",
      variant: "destructive",
    });
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-full md:max-w-4xl p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold text-primary-foreground">
              מערכת אבחון חיצונית
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p>טוען מערכת אבחון...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="bg-destructive/10 p-4 rounded-md max-w-md text-center">
                <p className="text-destructive font-medium">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                      iframe.src = url;
                    }
                  }}
                >
                  נסה שנית
                </Button>
              </div>
            </div>
          )}
          
          <iframe 
            src={url}
            className="w-full h-full border-0"
            title="מערכת אבחון חיצונית"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            referrerPolicy="no-referrer"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExternalAssessmentFrame;

