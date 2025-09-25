import { useState, useEffect } from "react";
import { Check, School } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserProfile } from "@/services/userProfileService";

type AssignedClass = NonNullable<UserProfile["assignedClasses"]>[0];

interface ClassSwitcherProps {
  teacherId: string;
  language: "en" | "he";
  onClassChange: (classData: AssignedClass) => void;
  classOptions: AssignedClass[];
}

export const ClassSwitcher = ({
  teacherId,
  language,
  onClassChange,
  classOptions,
}: ClassSwitcherProps) => {
  const translations = {
    en: {
      switchClass: "Switch Class",
      chooseClass: "Choose class",
      noClasses: "No classes available",
    },
    he: {
      switchClass: "החלף כיתה",
      chooseClass: "בחר כיתה",
      noClasses: "אין כיתות זמינות",
    },
  };

  const [selectedClassValue, setSelectedClassValue] = useState<
    string | undefined
  >(undefined);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && classOptions && classOptions.length > 0) {
      const activeClass = classOptions.find((cls) => cls.isActive);
      if (activeClass) {
        const value = `${activeClass.schoolId}|${activeClass.classId}`;
        setSelectedClassValue(value);
        onClassChange(activeClass);
        setInitialized(true);
      }
    }
  }, [classOptions, onClassChange, initialized]);

  const handleClassChange = (value: string) => {
    setSelectedClassValue(value);

    const [schoolId, classId] = value.split("|");
    const selectedClass = classOptions.find(
      (cls) => cls.schoolId === schoolId && cls.classId === classId
    );

    if (selectedClass) {
      onClassChange(selectedClass);

      const message =
        language === "he"
          ? `עברת לכיתה ${selectedClass.className} בבית ספר ${selectedClass.schoolName}`
          : `Switched to class ${selectedClass.className} in ${selectedClass.schoolName}`;

      toast.success(message, {
        duration: 2500, // משך הופעת ההודעה במילישניות
      });
    }
  };

  const t = translations[language];

  const activeClass = classOptions.find((cls) => cls.isActive);
  const activeValue = activeClass
    ? `${activeClass.schoolId}|${activeClass.classId}`
    : undefined;

  return (
    <div className="flex items-center gap-2">
      <div className="w-full">
        <Select
          value={selectedClassValue}
          onValueChange={handleClassChange}
          disabled={!classOptions.length}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800">
            <SelectValue placeholder={t.chooseClass} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 z-50">
            {classOptions.map((cls) => (
              <SelectItem
                key={`${cls.schoolId}-${cls.classId}`}
                value={`${cls.schoolId}|${cls.classId}`}
              >
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  <span>
                    {cls.schoolName} - {cls.className}
                  </span>
                  {cls.isActive && <Check className="h-4 w-4 ml-auto" />}
                </div>
              </SelectItem>
            ))}
            {classOptions.length === 0 && (
              <div className="p-2 text-center text-muted-foreground">
                {t.noClasses}
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
