// src/components/student/TaskListSection.tsx
import TaskItem from "@/components/student/TaskItem";

interface Task {
  id: string;
  title: string;
  minutes: number;
  color: string;
  stars: number;
  completed: boolean;
  category: string;
}

interface TaskListSectionProps {
  tasks: Task[];
  currentTask: Task | null;
  tasksTitle: string;
  todayText: string;
  minutesText: string;
  onToggleComplete: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  allowedCategories: readonly string[];
  extraTime: number;
}

const TaskListSection = ({
  tasks,
  currentTask,
  tasksTitle,
  todayText,
  minutesText,
  onToggleComplete,
  onSelectTask,
  onDeleteTask,
  allowedCategories,
  extraTime,
}: TaskListSectionProps) => {
  return (
    <div className="flex flex-col justify-self-end order-2 md:order-3 w-full">
      <div className="mb-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800/80 dark:to-purple-900/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium text-blue-800 dark:text-blue-300">
          {tasksTitle}
        </h2>
        <span className="text-sm font-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-purple-600 dark:text-purple-300">
          {todayText}
        </span>
      </div>

      <div className="overflow-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={String(task.id)}
            title={task.title}
            timeEstimation={`${task.minutes} ${minutesText}`}
            color={task.color}
            stars={task.stars}
            completed={task.completed}
            onToggleComplete={onToggleComplete}
            extraTime={extraTime}
            onSelect={() => onSelectTask(task)}
            onDelete={onDeleteTask}
            isSelected={currentTask?.id === task.id}
            category={
              allowedCategories.includes(task.category)
                ? (task.category as any)
                : "blue"
            }
          />
        ))}
      </div>
    </div>
  );
};

export default TaskListSection;
