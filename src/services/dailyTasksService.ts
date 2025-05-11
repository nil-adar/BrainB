import { mockStudents } from "./mock/students";
import { taskService } from "./taskService";

export interface DailyTask {
  id: string;
  title: string;
  notes: string;
  studentId: string;
  date: string;
  completed?: boolean;
}

// Simulate a local storage for tasks
const localTasksStore: Record<string, DailyTask[]> = {};

// Helper function to generate a storage key
const getStorageKey = (studentId: string, date: string) => `tasks_${studentId}_${date}`;

const generateTaskDescription = (title: string, date: string) => `${title.trim()} [${date}]`;

export const dailyTasksService = {
  // Get tasks for a specific student on a specific date
  getStudentTasks: async (studentId: string, date: string) => {
    return new Promise<DailyTask[]>((resolve) => {
      setTimeout(() => {
        const storageKey = getStorageKey(studentId, date);
        const storedTasks = localTasksStore[storageKey];

        if (storedTasks && storedTasks.length > 0) {
          resolve(storedTasks);
          return;
        }

        const student = mockStudents.find(s => s.id === studentId);
        if (!student) {
          resolve([]);
          return;
        }

        const dailyTasks = student.tasks
          .filter(task => task.description.includes(`[${date}]`))
          .map(task => {
            const title = task.description.replace(`[${date}]`, "").trim();
            return {
              id: task.id,
              title,
              notes: "",
              studentId,
              date,
              completed: task.completed
            };
          });

        if (dailyTasks.length > 0) {
          localTasksStore[storageKey] = dailyTasks;
        }

        resolve(dailyTasks);
      }, 500);
    });
  },

  // Save tasks for a student
  saveTasks: async (tasks: DailyTask[], date: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        try {
          const tasksByStudent: Record<string, DailyTask[]> = {};

          tasks.forEach(task => {
            if (!tasksByStudent[task.studentId]) {
              tasksByStudent[task.studentId] = [];
            }
            tasksByStudent[task.studentId].push(task);
          });

          for (const studentId in tasksByStudent) {
            const studentTasks = tasksByStudent[studentId];
            const storageKey = getStorageKey(studentId, date);
            localTasksStore[storageKey] = studentTasks;

            const student = mockStudents.find(s => s.id === studentId);
            if (student) {
              student.tasks = student.tasks.filter(task => !task.description.includes(`[${date}]`));

              for (const task of studentTasks) {
                await taskService.addTask(studentId, {
                  description: generateTaskDescription(task.title, date),
                  completed: task.completed || false
                });
              }
            }
          }

          resolve(true);
        } catch (error) {
          console.error("Error saving tasks:", error);
          resolve(false);
        }
      }, 700);
    });
  },

  // Save tasks for all students in a class
  saveTasksForClass: async (tasks: Omit<DailyTask, "studentId">[], classId: string, date: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        try {
          const classStudents = mockStudents.filter(s => s.class === classId);//לבדוק s.class if is  relevant 

          if (classStudents.length === 0) {
            resolve(false);
            return;
          }

          for (const student of classStudents) {
            const storageKey = getStorageKey(student.id, date);
            const studentTasks: DailyTask[] = tasks.map(task => ({
              ...task,
              studentId: student.id,
              date
            }));

            localTasksStore[storageKey] = studentTasks;

            student.tasks = student.tasks.filter(task => !task.description.includes(`[${date}]`));

            for (const task of tasks) {
              await taskService.addTask(student.id, {
                description: generateTaskDescription(task.title, date),
                completed: task.completed || false
              });
            }
          }

          resolve(true);
        } catch (error) {
          console.error("Error saving tasks for class:", error);
          resolve(false);
        }
      }, 1000);
    });
  }
};
