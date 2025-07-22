import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { studentService } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Clock, Star, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useParams } from "react-router-dom";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed?: boolean;
  color: string;
  minutes: number;
  stars: number;
}

export default function DailyTasks() {
  const { teacherId, classId } = useParams();

  if (!teacherId || !classId) {
    return <div>⚠️ כתובת URL שגויה – חסרים מזהים</div>;
  }

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


  

  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  const starsOptions = [1, 2, 3];
  
  const { data: students = [], isLoading } = useQuery({
  queryKey: ["students", teacherId],
  queryFn: async () => {
    const result = await studentService.getTeacherStudents(teacherId);
    console.log("🧪 students loaded:", result); // ← פה נראה את כל השמות וה־_id
    return result;
  },
  enabled: !!teacherId,
});
const navigate = useNavigate();

const handleBack = () => {
  navigate(-1);
};


 const handleAddTask = async () => {
  if (!newTaskTitle.trim()) return;

  if (!teacherId || !classId) {
    alert("Missing teacher or class identifier");
    return;
  }

  if (!selectedStudent && !assignToAll) {
    alert("בחר תלמיד לשיוך המשימה");
    return;
  }

  let tasksToSave;
  console.log("📌 selectedStudent:", selectedStudent);
  const matched = students.find(s => s.id === selectedStudent);
  console.log("📌 matched student object:", matched);

  if (assignToAll) {
    tasksToSave = students.map(student => ({
      title: newTaskTitle,
      notes: newTaskNotes,
      studentId: student.id,
      createdBy: teacherId,
      classId: classId,
      color: newTaskColor,
      minutes: newTaskMinutes,
      stars: newTaskStars,
      completed: false,
      date: new Date(newTaskDate)

    }));
  } else {
    tasksToSave = [{
      title: newTaskTitle,
      notes: newTaskNotes,
      studentId: selectedStudent, // כבר נבחר כ־_id מה־<select>
      createdBy: teacherId,
      classId: classId,
      color: newTaskColor,
      minutes: newTaskMinutes,
      stars: newTaskStars,
      completed: false,
      date: new Date(newTaskDate)
    }];
  }

  try {
    console.log("📤 Sending tasksToSave:", tasksToSave);
    const res = await axios.post("/api/tasks", tasksToSave);
    console.log("✅ Task(s) saved:", res.data);
    alert("המשימה נשמרה בהצלחה!");
    setNewTaskTitle("");
    setNewTaskNotes("");
    setTasks([]);
  } catch (err) {
    console.error("❌ Error saving task:", err);
    alert("שגיאה בשמירת המשימה");
    console.log("🧪 selectedStudent:", selectedStudent);

  }
};


  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNewTaskMinutes(isNaN(value) || value < 0 ? 0 : value);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
    <div className="flex justify-start mb-4">

  <Button
    variant="outline"
    className="text-base px-4 py-2"
    onClick={handleBack}
  >
    ← חזרה
  </Button>
</div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-slate-50 rounded-t-lg border-b p-8">
          <CardTitle className="text-2xl font-medium text-slate-800">הגדרות שיוך</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-100">
            <Label htmlFor="assignAll" className="text-xl font-medium text-slate-700">שייך לכל התלמידים בכיתה</Label>
            <Switch id="assignAll" checked={assignToAll} onCheckedChange={setAssignToAll} />
          </div>

          {!assignToAll && (
            <div className="space-y-4">
              <Label htmlFor="studentSelect" className="block text-xl font-medium text-slate-700">בחר תלמיד</Label>
  <select
  value={selectedStudent}
  onChange={(e) => {
    console.log("🧪 onChange raw value:", e.target.value); // ← צריך להדפיס ObjectId
    setSelectedStudent(e.target.value);
  }}
>
  <option value="">בחר תלמיד</option>
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
          <CardTitle className="text-2xl font-medium text-slate-800">הוספת משימה חדשה</CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div>
            <Label htmlFor="taskTitle" className="block text-xl font-medium text-slate-700 mb-3">כותרת המשימה</Label>
            <Input 
              id="taskTitle"
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)} 
              placeholder="כותרת המשימה..."
              className="border-slate-300 focus:border-cyan-500 text-xl p-6 h-16"
            />
          </div>
          
          <div>
            <Label htmlFor="taskNotes" className="block text-xl font-medium text-slate-700 mb-3">הערות</Label>
            <Textarea 
              id="taskNotes"
              value={newTaskNotes} 
              onChange={(e) => setNewTaskNotes(e.target.value)} 
              placeholder="הערות למשימה..."
              className="border-slate-300 focus:border-cyan-500 min-h-[180px] text-lg p-5"
            />
          </div>
          <div>
  <Label htmlFor="taskDate" className="block text-xl font-medium text-slate-700 mb-3">
    תאריך המשימה
  </Label>
  <Input
    id="taskDate"
    type="date"
    value={newTaskDate}
    onChange={(e) => setNewTaskDate(e.target.value)}
    className="border-slate-300 focus:border-cyan-500 text-xl p-6 h-16"
    min={new Date().toISOString().split("T")[0]} // מונע בחירה של תאריך עבר
  />
</div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 items-end">
            <div className="space-y-3">
              <Label htmlFor="taskColor" className="block text-xl font-medium text-slate-700 mb-3 flex items-center">
                <Palette className="h-6 w-6 mr-2 text-slate-500" />
                צבע
              </Label>
              <select 
                id="taskColor"
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={newTaskColor} 
                onChange={(e) => setNewTaskColor(e.target.value)}
              >
                {colors.map(c => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="taskDuration" className="block text-xl font-medium text-slate-700 mb-3 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-slate-500" />
                זמן (דקות)
              </Label>
              <Input
                id="taskDuration"
                type="number"
                min="1"
                value={newTaskMinutes}
                onChange={handleMinutesChange}
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="הזן מספר דקות..."
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="taskStars" className="block text-xl font-medium text-slate-700 mb-3 flex items-center">
                <Star className="h-6 w-6 mr-2 text-slate-500" />
                כוכבים
              </Label>
              <select
                id="taskStars"
                className="w-full p-4 h-16 text-lg bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={newTaskStars}
                onChange={(e) => setNewTaskStars(Number(e.target.value))}
              >
                {starsOptions.map(s => (
                  <option key={s} value={s}>
                    {"★".repeat(s)}
                  </option>
                ))}
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
            <Plus className="mr-2 h-7 w-7" /> הוסף משימה
          </Button>
        </CardFooter>
      </Card>

      {tasks.length > 0 && (
        <Card className="shadow-md border-slate-200">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b p-8">
            <CardTitle className="text-2xl font-medium text-slate-800">משימות שנוספו ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            {tasks.map(task => (
              <div key={task.id} className={`p-8 rounded-md bg-${task.color}-50 border border-${task.color}-200 flex justify-between`}>
                <div>
                  <h4 className="font-medium text-xl">{task.title}</h4>
                  {task.notes && <p className="text-lg text-slate-600 mt-3">{task.notes}</p>}
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg text-slate-600 flex items-center">
                    <Clock className="h-5 w-5 mr-2" /> {task.minutes} דקות
                  </span>
                  <span className="text-amber-500 text-2xl">{"★".repeat(task.stars)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="flex gap-6 flex-wrap">
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex-1 min-w-[250px]">
          <h2 className="text-xl font-bold mb-4">מקרא צבעים</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-red-500 mr-3"></span>
              <span className="text-lg">אדום - משימה דחופה / חשובה מאוד</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-orange-500 mr-3"></span>
              <span className="text-lg">כתום - קשה / מאתגרת</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-yellow-500 mr-3"></span>
              <span className="text-lg">צהוב - משימה רגילה / ניטרלית</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-green-500 mr-3"></span>
              <span className="text-lg">ירוק - קלה / מהנה / בוסט</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-500 mr-3"></span>
              <span className="text-lg">כחול - למידה עצמאית / רגועה</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-purple-500 mr-3"></span>
              <span className="text-lg">סגול - יצירתיות / ביטוי עצמי</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex-1 min-w-[250px]">
          <h2 className="text-xl font-bold mb-4">מקרא כוכבים</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-amber-500 text-2xl mr-3">★</span>
              <span className="text-lg">משימה בסיסית / פשוטה</span>
            </div>
            <div className="flex items-center">
              <span className="text-amber-500 text-2xl mr-3">★★</span>
              <span className="text-lg">משימה בינונית / סטנדרטית</span>
            </div>
            <div className="flex items-center">
              <span className="text-amber-500 text-2xl mr-3">★★★</span>
              <span className="text-lg">משימה מאתגרת / מתגמלת</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}