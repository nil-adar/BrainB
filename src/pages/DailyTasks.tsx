import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { studentService } from "@/services/studentService";
import { useSettings } from "@/components/SettingsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Clock, Star, Palette } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import HelpButton from "@/components/HelpButton";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed?: boolean;
  color: string;
  minutes: number;
  stars: number;
}

// תרגומים מרכזיים
const translations = {
  he: {
    // Header
    backButton: "← חזרה",
    assignmentSettings: "הגדרות שיוך",
    assignToAll: "שייך לכל התלמידים בכיתה",
    selectStudent: "בחר תלמיד",
    selectStudentPlaceholder: "בחר תלמיד",

    // Task form
    addNewTask: "הוספת משימה חדשה",
    taskTitle: "כותרת המשימה",
    taskTitlePlaceholder: "כותרת המשימה...",
    notes: "הערות",
    notesPlaceholder: "הערות למשימה...",
    taskDate: "תאריך המשימה",
    color: "צבע",
    timeMinutes: "זמן (דקות)",
    stars: "כוכבים",
    minutesPlaceholder: "הזן מספר דקות...",
    addTask: "הוסף משימה",

    // Colors
    red: "אדום",
    orange: "כתום",
    yellow: "צהוב",
    green: "ירוק",
    blue: "כחול",
    purple: "סגול",

    // Tasks list
    tasksAdded: "משימות שנוספו",
    minutes: "דקות",

    // Color legend
    colorLegend: "מקרא צבעים",
    redDesc: "אדום - משימה דחופה / חשובה מאוד",
    orangeDesc: "כתום - קשה / מאתגרת",
    yellowDesc: "צהוב - משימה רגילה / ניטרלית",
    greenDesc: "ירוק - קלה / מהנה / בוסט",
    blueDesc: "כחול - למידה עצמאית / רגועה",
    purpleDesc: "סגול - יצירתיות / ביטוי עצמי",

    // Stars legend
    starsLegend: "מקרא כוכבים",
    oneStarDesc: "משימה בסיסית / פשוטה",
    twoStarsDesc: "משימה בינונית / סטנדרטית",
    threeStarsDesc: "משימה מאתגרת / מתגמלת",

    // Messages
    selectStudentError: "בחר תלמיד לשיוך המשימה",
    taskSavedSuccess: "המשימה נשמרה בהצלחה!",
    taskSaveError: "שגיאה בשמירת המשימה",
    missingIdentifierError: "Missing teacher or class identifier",
    wrongUrlError: "⚠️ כתובת URL שגויה – חסרים מזהים",
  },
  en: {
    // Header
    backButton: "← Back",
    assignmentSettings: "Assignment Settings",
    assignToAll: "Assign to all students in class",
    selectStudent: "Select Student",
    selectStudentPlaceholder: "Select a student",

    // Task form
    addNewTask: "Add New Task",
    taskTitle: "Task Title",
    taskTitlePlaceholder: "Task title...",
    notes: "Notes",
    notesPlaceholder: "Task notes...",
    taskDate: "Task Date",
    color: "Color",
    timeMinutes: "Time (minutes)",
    stars: "Stars",
    minutesPlaceholder: "Enter number of minutes...",
    addTask: "Add Task",

    // Colors
    red: "Red",
    orange: "Orange",
    yellow: "Yellow",
    green: "Green",
    blue: "Blue",
    purple: "Purple",

    // Tasks list
    tasksAdded: "Tasks Added",
    minutes: "minutes",

    // Color legend
    colorLegend: "Color Legend",
    redDesc: "Red - Urgent / Very Important Task",
    orangeDesc: "Orange - Difficult / Challenging",
    yellowDesc: "Yellow - Regular / Neutral Task",
    greenDesc: "Green - Easy / Fun / Boost",
    blueDesc: "Blue - Independent / Calm Learning",
    purpleDesc: "Purple - Creativity / Self Expression",

    // Stars legend
    starsLegend: "Stars Legend",
    oneStarDesc: "Basic / Simple task",
    twoStarsDesc: "Medium / Standard task",
    threeStarsDesc: "Challenging / Rewarding task",

    // Messages
    selectStudentError: "Please select a student to assign the task",
    taskSavedSuccess: "Task saved successfully!",
    taskSaveError: "Error saving task",
    missingIdentifierError: "Missing teacher or class identifier",
    wrongUrlError: "⚠️ Wrong URL - missing identifiers",
  },
};

export default function DailyTasks() {
  const { teacherId, classId } = useParams();
  const { language } = useSettings();
  const t = translations[language];
  const isHeb = language === "he";
  const [assignToAll, setAssignToAll] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [newTaskColor, setNewTaskColor] = useState("blue");
  const [newTaskMinutes, setNewTaskMinutes] = useState(5);
  const [newTaskStars, setNewTaskStars] = useState(2);
  const [newTaskDate, setNewTaskDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", teacherId],
    queryFn: async () => {
      const result = await studentService.getTeacherStudents(teacherId);
      console.log("🧪 students loaded:", result);
      return result;
    },
    enabled: !!teacherId,
  });

  const navigate = useNavigate();

  if (!teacherId || !classId) {
    return <div>{t.wrongUrlError}</div>;
  }

  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  const starsOptions = [1, 2, 3];

  // פונקציה להצגת שם הצבע בשפה הנכונה
  const getColorName = (color: string) => {
    return t[color as keyof typeof t] || color;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    if (!teacherId || !classId) {
      alert(t.missingIdentifierError);
      return;
    }

    if (!selectedStudent && !assignToAll) {
      alert(t.selectStudentError);
      return;
    }

    let tasksToSave;
    console.log("📌 selectedStudent:", selectedStudent);
    const matched = students.find((s) => s.id === selectedStudent);
    console.log("📌 matched student object:", matched);

    if (assignToAll) {
      tasksToSave = students.map((student) => ({
        title: newTaskTitle,
        notes: newTaskNotes,
        studentId: student.id,
        createdBy: teacherId,
        classId: classId,
        color: newTaskColor,
        minutes: newTaskMinutes,
        stars: newTaskStars,
        completed: false,
        date: new Date(newTaskDate),
      }));
    } else {
      tasksToSave = [
        {
          title: newTaskTitle,
          notes: newTaskNotes,
          studentId: selectedStudent,
          createdBy: teacherId,
          classId: classId,
          color: newTaskColor,
          minutes: newTaskMinutes,
          stars: newTaskStars,
          completed: false,
          date: new Date(newTaskDate),
        },
      ];
    }

    try {
      console.log("📤 Sending tasksToSave:", tasksToSave);
      const res = await axios.post("/api/tasks", tasksToSave);
      console.log("✅ Task(s) saved:", res.data);
      alert(t.taskSavedSuccess);
      setNewTaskTitle("");
      setNewTaskNotes("");
      setTasks([]);
    } catch (err) {
      console.error("❌ Error saving task:", err);
      alert(t.taskSaveError);
      console.log("🧪 selectedStudent:", selectedStudent);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNewTaskMinutes(isNaN(value) || value < 0 ? 0 : value);
  };

  return (
    <div
      className="space-y-8 max-w-5xl mx-auto py-8"
      dir={language === "he" ? "rtl" : "ltr"}
    >
      {/* Top bar: Back + Help */}
      <div
        className={`flex items-center mb-4 justify-between ${
          isHeb ? "flex-row-reverse" : ""
        }`}
      >
        <Button
          variant="outline"
          className="text-base px-4 py-2"
          onClick={handleBack}
        >
          {t.backButton}
        </Button>

        {/* כפתור העזרה – שפה אוטומטית, עמוד מתאים */}
        <HelpButton
          page="createTask"
          language={language}
          variant="icon" // אפשר "icon" אם את מעדיפה איקון בלבד
          className="px-4 py-2" // padding עדין כדי שלא יידחף למטה
        />
      </div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-slate-50 rounded-t-lg border-b p-8">
          <CardTitle className="text-2xl font-medium text-slate-800">
            {t.assignmentSettings}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-100">
            <Label
              htmlFor="assignAll"
              className="text-xl font-medium text-slate-700"
            >
              {t.assignToAll}
            </Label>
            <Switch
              id="assignAll"
              checked={assignToAll}
              onCheckedChange={setAssignToAll}
            />
          </div>

          {!assignToAll && (
            <div className="space-y-4">
              <Label
                htmlFor="studentSelect"
                className="block text-xl font-medium text-slate-700"
              >
                {t.selectStudent}
              </Label>
              <select
                value={selectedStudent}
                onChange={(e) => {
                  console.log("🧪 onChange raw value:", e.target.value);
                  setSelectedStudent(e.target.value);
                }}
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">{t.selectStudentPlaceholder}</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-slate-50 rounded-t-lg border-b p-8">
          <CardTitle className="text-2xl font-medium text-slate-800">
            {t.addNewTask}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div>
            <Label
              htmlFor="taskTitle"
              className="block text-xl font-medium text-slate-700 mb-3"
            >
              {t.taskTitle}
            </Label>
            <Input
              id="taskTitle"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={t.taskTitlePlaceholder}
              className="border-slate-300 focus:border-cyan-500 text-xl p-6 h-16"
            />
          </div>

          <div>
            <Label
              htmlFor="taskNotes"
              className="block text-xl font-medium text-slate-700 mb-3"
            >
              {t.notes}
            </Label>
            <Textarea
              id="taskNotes"
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="border-slate-300 focus:border-cyan-500 min-h-[180px] text-lg p-5"
            />
          </div>

          <div>
            <Label
              htmlFor="taskDate"
              className="block text-xl font-medium text-slate-700 mb-3"
            >
              {t.taskDate}
            </Label>
            <Input
              id="taskDate"
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              className="border-slate-300 focus:border-cyan-500 text-xl p-6 h-16"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 items-end">
            <div className="space-y-3">
              <Label
                htmlFor="taskColor"
                className="block text-xl font-medium text-slate-700 mb-3 flex items-center"
              >
                <Palette className="h-6 w-6 mr-2 text-slate-500" />
                {t.color}
              </Label>
              <select
                id="taskColor"
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={newTaskColor}
                onChange={(e) => setNewTaskColor(e.target.value)}
              >
                <option value="red">
                  🔴 {getColorName("red")} -{" "}
                  {language === "he"
                    ? "דחוף / חשוב מאוד"
                    : "Urgent / Very Important"}
                </option>
                <option value="orange">
                  🟠 {getColorName("orange")} -{" "}
                  {language === "he"
                    ? "קשה / מאתגר"
                    : "Difficult / Challenging"}
                </option>
                <option value="yellow">
                  🟡 {getColorName("yellow")} -{" "}
                  {language === "he" ? "רגיל / ניטרלי" : "Regular / Neutral"}
                </option>
                <option value="green">
                  🟢 {getColorName("green")} -{" "}
                  {language === "he" ? "קל / מהנה" : "Easy / Fun"}
                </option>
                <option value="blue">
                  🔵 {getColorName("blue")} -{" "}
                  {language === "he" ? "למידה עצמאית" : "Independent Learning"}
                </option>
                <option value="purple">
                  🟣 {getColorName("purple")} -{" "}
                  {language === "he"
                    ? "יצירתי / ביטוי עצמי"
                    : "Creative / Self Expression"}
                </option>
              </select>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="taskDuration"
                className="block text-xl font-medium text-slate-700 mb-3 flex items-center"
              >
                <Clock className="h-6 w-6 mr-2 text-slate-500" />
                {t.timeMinutes}
              </Label>
              <Input
                id="taskDuration"
                type="number"
                min="1"
                value={newTaskMinutes}
                onChange={handleMinutesChange}
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t.minutesPlaceholder}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="taskStars"
                className="block text-xl font-medium text-slate-700 mb-3 flex items-center"
              >
                <Star className="h-6 w-6 mr-2 text-slate-500" />
                {t.stars}
              </Label>
              <select
                id="taskStars"
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={newTaskStars}
                onChange={(e) => setNewTaskStars(Number(e.target.value))}
              >
                <option value={1}>
                  ★ - {language === "he" ? "בסיסית / פשוטה" : "Basic / Simple"}
                </option>
                <option value={2}>
                  ★★ -{" "}
                  {language === "he"
                    ? "בינונית / סטנדרטית"
                    : "Medium / Standard"}
                </option>
                <option value={3}>
                  ★★★ -{" "}
                  {language === "he"
                    ? "מאתגרת / מתגמלת"
                    : "Challenging / Rewarding"}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-10 pt-2">
          <Button
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium text-xl py-10"
            size="lg"
          >
            <Plus className="mr-2 h-7 w-7" /> {t.addTask}
          </Button>
        </CardFooter>
      </Card>

      {tasks.length > 0 && (
        <Card className="shadow-md border-slate-200">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b p-8">
            <CardTitle className="text-2xl font-medium text-slate-800">
              {t.tasksAdded} ({tasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-8 rounded-md bg-${task.color}-50 border border-${task.color}-200 flex justify-between`}
              >
                <div>
                  <h4 className="font-medium text-xl">{task.title}</h4>
                  {task.notes && (
                    <p className="text-lg text-slate-600 mt-3">{task.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg text-slate-600 flex items-center">
                    <Clock className="h-5 w-5 mr-2" /> {task.minutes}{" "}
                    {t.minutes}
                  </span>
                  <span className="text-amber-500 text-2xl">
                    {"★".repeat(task.stars)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
