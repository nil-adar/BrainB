import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Plus, Edit, Trash2, Save, Check } from "lucide-react";
import { studentService } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

const dailyTasksTranslations = {
  en: {
    back: "Back",
    home: "Home",
    updateDailyTasks: "Update Daily Tasks",
    student: "Student",
    selectStudent: "Select a student",
    select: "Please select a student or enable 'assign to all'",
    date: "Date",
    saving: "Saving...",
    success: "Tasks saved successfully",
    error: "An error occurred while saving tasks",
    noTasks: "No tasks found",
    saveChanges: "Save Changes",
    tasks: "Tasks"
  },
  he: {
    back: "חזור",
    home: "דף הבית",
    updateDailyTasks: "עדכון משימות יומיות",
    student: "תלמיד",
    selectStudent: "בחר תלמיד",
    select: "יש לבחור תלמיד או לבחור 'שייך לכל התלמידים'",
    date: "תאריך",
    saving: "שומר...",
    success: "המשימות נשמרו בהצלחה",
    error: "אירעה שגיאה בשמירת המשימות",
    noTasks: "לא נמצאו משימות",
    saveChanges: "שמור שינויים",
    tasks: "משימות"
  }
};


export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed?: boolean;
}

const DailyTasks = () => {
  const navigate = useNavigate();
  const language = document.documentElement.dir === "rtl" ? "he" : "en";
  const t = dailyTasksTranslations[language];

  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [assignToAll, setAssignToAll] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskNotes, setNewTaskNotes] = useState<string>("");
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAllStudents
  });

  const breadcrumbItems = [
    { label: t.home, href: "/" },
    { label: selectedStudent ? students?.find(s => s.id === selectedStudent)?.firstName || "" : "", href: selectedStudent ? `/student/${selectedStudent}` : "" },
    { label: t.tasks },
  ];

  useEffect(() => {
    if (selectedStudent && selectedDate) {
      loadTasksForDate();
    } else {
      setTasks([]);
    }
  }, [selectedStudent, selectedDate]);

  const loadTasksForDate = async () => {
    if (!selectedStudent && !assignToAll) {
      toast.error(t.select);
      return;
    }
    setIsLoadingTasks(true);
    try {
      if (selectedStudent) {
        const studentTasks = await dailyTasksService.getStudentTasks(selectedStudent, selectedDate);
        setTasks(studentTasks);
        if (studentTasks.length === 0) toast.info(t.noTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleSave = async () => {
    if (!selectedDate) return toast.error(t.selectDate);
    if (!selectedStudent && !assignToAll) return toast.error(t.select);
    setIsLoading(true);
    toast.loading(t.saving);

    try {
      let success = false;
      if (assignToAll) {
        success = await dailyTasksService.saveTasksForClass(tasks.map(task => ({
          ...task,
          date: selectedDate
        })), "class-1", selectedDate);
      } else {
        success = await dailyTasksService.saveTasks(tasks.map(task => ({
          ...task,
          studentId: selectedStudent,
          date: selectedDate
        })), selectedDate);
      }
      success ? toast.success(t.success) : toast.error(t.error);
    } catch (error) {
      toast.error(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    if (studentId && assignToAll) setAssignToAll(false);
  };

  const handleAssignToAllToggle = (checked: boolean) => {
    setAssignToAll(checked);
    if (checked && selectedStudent) setSelectedStudent("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      notes: newTaskNotes,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskNotes("");
  };

  const handleTaskChange = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
  };

  const taskLocale = {
    title: language === "he" ? "כותרת המשימה..." : "Task title...",
    notes: language === "he" ? "הערות..." : "Notes...",
    completed: language === "he" ? "הושלם" : "Completed",
    save: language === "he" ? "שמור" : "Save",
    cancel: language === "he" ? "ביטול" : "Cancel"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 hover:bg-gray-100 p-2 rounded-lg">
        <ArrowLeft className="w-5 h-5" />
        <span>{t.back}</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t.updateDailyTasks}</h1>

        <div className="space-y-6">
          <Card className="p-4 space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Switch id="assign-all" checked={assignToAll} onCheckedChange={handleAssignToAllToggle} />
              <Label htmlFor="assign-all" className="font-medium">
                {language === "he" ? "שייך לכל התלמידים בכיתה" : "Assign to all students in class"}
              </Label>
            </div>

            {!assignToAll && (
              <div>
                <label className="block text-sm font-medium mb-1">{t.student}</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  disabled={isLoadingStudents || assignToAll}
                >
                  <option value="">{isLoadingStudents ? (language === "he" ? "טוען תלמידים..." : "Loading students...") : t.selectStudent}</option>
                  {students?.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium mb-1">{t.date}</label>
                <input type="date" className="w-full p-2 border rounded-lg" value={selectedDate} onChange={handleDateChange} />
              </div>

              <Card className="p-4">
                <h3 className="text-md font-medium mb-3">{language === "he" ? "הוסף משימה חדשה" : "Add New Task"}</h3>
                <div className="space-y-4">
                  <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={taskLocale.title} />
                  <Textarea value={newTaskNotes} onChange={(e) => setNewTaskNotes(e.target.value)} placeholder={taskLocale.notes} rows={3} />
                  <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> {language === "he" ? "הוסף משימה" : "Add Task"}
                  </Button>
                </div>
              </Card>

              <div>
                {tasks.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                    {language === "he" ? "אין משימות עדיין." : "No tasks added yet."}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <Card key={task.id} className="p-4 border rounded-lg">
                        {editingTask === task.id ? (
                          <div>
                            <Input type="text" value={task.title} onChange={(e) => handleTaskChange({ ...task, title: e.target.value })} />
                            <Textarea value={task.notes} onChange={(e) => handleTaskChange({ ...task, notes: e.target.value })} />
                            <div className="flex justify-end gap-2 mt-2">
                              <Button variant="outline" onClick={() => setEditingTask(null)}>{taskLocale.cancel}</Button>
                              <Button variant="default" onClick={() => setEditingTask(null)}><Check className="h-4 w-4 mr-1" /> {taskLocale.save}</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{task.title}</h3>
                              {task.notes && <p className="text-sm text-gray-600">{task.notes}</p>}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" onClick={() => handleEditTask(task.id)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90" disabled={isLoading || isLoadingTasks || (!selectedStudent && !assignToAll)}>
                {isLoading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> {t.saveChanges}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;