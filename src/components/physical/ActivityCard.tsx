
import { Play, Pause, RotateCcw, Dumbbell, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity as ActivityType, Translations } from "@/types/activity";

interface ActivityCardProps {
  activity: ActivityType;
  t: Translations;
  onDurationChange: (activityId: string, duration: string) => void;
  onStart: (activityId: string) => void;
  onPause: (activityId: string) => void;
  onReset: (activityId: string) => void;
  formatTime: (seconds: number) => string;
}

const iconMap = {
  'yoga': Activity,      // Changed from Yoga to Activity
  'walking': Activity,   // Changed from Walking to Activity
  'dumbbell': Dumbbell
};

export function ActivityCard({
  activity,
  t,
  onDurationChange,
  onStart,
  onPause,
  onReset,
  formatTime,
}: ActivityCardProps) {
  const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Dumbbell;

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <img 
          src={activity.imageUrl} 
          alt={`${activity.title} exercises`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full p-2">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <CardTitle className="text-xl font-semibold mb-2">
          {activity.title}
        </CardTitle>
        <CardDescription className="mb-4">
          {activity.description}
        </CardDescription>
        <div className="mt-auto space-y-4 pt-4">
          <Select
            value={activity.timer.duration}
            onValueChange={(value) => onDurationChange(activity.id, value)}
            disabled={activity.timer.isActive}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.selectDuration} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 {t.minutes}</SelectItem>
              <SelectItem value="30">30 {t.minutes}</SelectItem>
              <SelectItem value="45">45 {t.minutes}</SelectItem>
              <SelectItem value="60">60 {t.minutes}</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">
              {formatTime(activity.timer.timeLeft)}
            </div>
            <p className="text-sm text-muted-foreground">{t.remainingTime}</p>
          </div>

          <div className="flex gap-2">
            {!activity.timer.isActive ? (
              <Button 
                className="flex-1"
                onClick={() => onStart(activity.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                {t.start}
              </Button>
            ) : (
              <Button 
                className="flex-1"
                variant="secondary"
                onClick={() => onPause(activity.id)}
              >
                <Pause className="w-4 h-4 mr-2" />
                {t.pause}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => onReset(activity.id)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
