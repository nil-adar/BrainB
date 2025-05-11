
export interface ActivityTimer {
  duration: string;
  timeLeft: number;
  isActive: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: "activity" | "yoga" | "walking" | "dumbbell" | "fitness" | "run" | "bicycle" | "swim";
  imageUrl: string;
  timer: ActivityTimer;
}

export interface Translations {
  title: string;
  search: string;
  greeting: string;
  home: string;
  recommendations: string;
  selectDuration: string;
  minutes: string;
  start: string;
  pause: string;
  reset: string;
  remainingTime: string;
  settings?: string;
  logout?: string;
}
