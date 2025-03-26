
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface MoodSelectorProps {
  feeling: string;
}

export const MoodSelector = ({ feeling }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <Card className="p-4 bg-card text-card-foreground">
      <h2 className="font-semibold mb-4">{feeling}</h2>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setSelectedMood("sad")}
          className={`text-4xl transition-opacity ${selectedMood === "sad" ? "opacity-100" : "opacity-50"}`}
        >
          😔
        </button>
        <button
          onClick={() => setSelectedMood("neutral")}
          className={`text-4xl transition-opacity ${selectedMood === "neutral" ? "opacity-100" : "opacity-50"}`}
        >
          😐
        </button>
        <button
          onClick={() => setSelectedMood("happy")}
          className={`text-4xl transition-opacity ${selectedMood === "happy" ? "opacity-100" : "opacity-50"}`}
        >
          😊
        </button>
      </div>
    </Card>
  );
};
