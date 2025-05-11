
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User, Settings } from "lucide-react";

interface ScheduleItem {
  time: string;
  subject: string;
  chapter: string;
  room: string;
  teacher: string;
}

interface ScheduleListProps {
  scheduleItems: ScheduleItem[];
}

export const ScheduleList = ({ scheduleItems }: ScheduleListProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">24</h2>
          <div className="text-sm text-muted-foreground">
            <div>January 2024</div>
            <div>Wednesday</div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          Today
        </Button>
      </div>

      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <Card key={index} className="p-4 bg-card">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-muted-foreground">{item.time}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-primary mb-1">{item.subject}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.chapter}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{item.room}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{item.teacher}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
