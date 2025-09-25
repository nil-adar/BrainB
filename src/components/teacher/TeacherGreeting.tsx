import { getTimeBasedGreeting } from "@/utils/timeGreetings";

interface TeacherGreetingProps {
  teacherName: string;
  language: "en" | "he";
  assignedClass?: string;
  classSwitcher?: React.ReactNode;
}

export const TeacherGreeting = ({
  teacherName,
  language,
  assignedClass,
  classSwitcher,
}: TeacherGreetingProps) => {
  const timeGreeting = getTimeBasedGreeting(language);
  const teacherTitle = language === "he" ? "המורה" : "Teacher";

  return (
    <div className="relative overflow-hidden mb-3 md:mb-2 rounded-xl shadow-md w-full p-1 md:p-2 z-5">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-indigo-100 opacity-80"></div>

      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, rgba(182, 182, 182, 0.4) 0, rgba(127, 231, 217, 0.4) 2px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row justify-center items-center p-6 z-10">
        <div className="flex-1 flex flex-col items-center text-center mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            {timeGreeting},{" "}
            <span className="text-stone-800 ">
              {teacherTitle} {teacherName}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {/*assignedClass || t.grade*/}
          </p>
        </div>

        <div className="flex flex-col items-center">
          {classSwitcher && <div className="w-full">{classSwitcher}</div>}
        </div>
      </div>
    </div>
  );
};
