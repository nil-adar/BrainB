
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Activity, ActivityTimer } from "@/types/activity";
import { translations } from "@/translations/physical";
import { Header } from "@/components/physical/Header";
import { ActivityCard } from "@/components/physical/ActivityCard";

// This is mock data - in the future this will come from your database
const mockActivities: Activity[] = [
  {
    id: "yoga",
    title: "Morning Yoga Routine",
    description: "Start your day with gentle stretches and breathing exercises to improve flexibility and reduce stress.",
    icon: "yoga",
    imageUrl: "/lovable-uploads/3f12a356-fe7c-4c73-8328-46f40eda5b61.png",
    timer: { duration: "15", timeLeft: 0, isActive: false }
  },
  {
    id: "walking",
    title: "Daily Walking Program",
    description: "A structured walking program that gradually increases duration and intensity to improve cardiovascular health.",
    icon: "walking",
    imageUrl: "/lovable-uploads/3f12a356-fe7c-4c73-8328-46f40eda5b61.png",
    timer: { duration: "15", timeLeft: 0, isActive: false }
  },
  {
    id: "strength",
    title: "Simple Strength Training",
    description: "Basic strength exercises you can do at home with minimal equipment to build muscle and improve stability.",
    icon: "dumbbell",
    imageUrl: "/lovable-uploads/3f12a356-fe7c-4c73-8328-46f40eda5b61.png",
    timer: { duration: "15", timeLeft: 0, isActive: false }
  }
];

export default function PhysicalRecommendations() {
  const [language, setLanguage] = useState(document.documentElement.dir === "rtl" ? "he" : "en");
  const t = translations[language];
  const currentDate = format(new Date(), "EEEE, MMM do, yyyy");
  const navigate = useNavigate();
  
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "he" : "en";
    setLanguage(newLanguage);
    document.documentElement.dir = newLanguage === "he" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prevActivities => {
        const updatedActivities = [...prevActivities];
        let hasChanges = false;

        updatedActivities.forEach((activity, index) => {
          if (activity.timer.isActive && activity.timer.timeLeft > 0) {
            updatedActivities[index] = {
              ...activity,
              timer: {
                ...activity.timer,
                timeLeft: activity.timer.timeLeft - 1
              }
            };
            hasChanges = true;
          } else if (activity.timer.isActive && activity.timer.timeLeft === 0) {
            updatedActivities[index] = {
              ...activity,
              timer: {
                ...activity.timer,
                isActive: false
              }
            };
            hasChanges = true;
          }
        });

        return hasChanges ? updatedActivities : prevActivities;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (activityId: string, duration: string) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId
          ? {
              ...activity,
              timer: {
                ...activity.timer,
                duration,
                timeLeft: parseInt(duration) * 60
              }
            }
          : activity
      )
    );
  };

  const handleStart = (activityId: string) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId
          ? {
              ...activity,
              timer: {
                ...activity.timer,
                timeLeft: parseInt(activity.timer.duration) * 60,
                isActive: true
              }
            }
          : activity
      )
    );
  };

  const handlePause = (activityId: string) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId
          ? {
              ...activity,
              timer: {
                ...activity.timer,
                isActive: false
              }
            }
          : activity
      )
    );
  };

  const handleReset = (activityId: string) => {
    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId
          ? {
              ...activity,
              timer: {
                ...activity.timer,
                timeLeft: parseInt(activity.timer.duration) * 60,
                isActive: false
              }
            }
          : activity
      )
    );
  };

  const breadcrumbItems = [
    { label: t.home, href: "/dashboard" },
    { label: "מיה פרץ", href: "/student/123" },
    { label: t.recommendations, href: "/recommendations" },
    { label: t.title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        t={t}
        currentDate={currentDate}
        language={language}
        toggleLanguage={toggleLanguage}
        breadcrumbItems={breadcrumbItems}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{`${t.greeting}, שרה`}</h1>
          <h2 className="text-2xl font-semibold text-gray-700">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              t={t}
              onDurationChange={handleDurationChange}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              formatTime={formatTime}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
