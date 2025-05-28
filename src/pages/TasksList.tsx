
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  duration: string;
  status: string;
  stars: number;
  color: string;
  completed: boolean;
  success: boolean;
}

interface TasksListProps {
  tasks: Task[];
  tasksLabel: string;
  currentTaskLabel: string;
  getTaskTitle: (taskKey: string) => string;
  onTaskCompletion: (taskId: string) => void;
}

export const TasksList = ({
  tasks,
  tasksLabel,
  currentTaskLabel,
  getTaskTitle,
  onTaskCompletion
}: TasksListProps) => {
  return (
    <Card className="p-4 bg-card text-card-foreground">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{currentTaskLabel}</h2>
        <Card className="p-8 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span>20:00</span>
          </div>
          <div className="w-40 h-40 mx-auto">
            <AnalogClock />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{tasksLabel}</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className={`p-4 ${task.color} ${task.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => onTaskCompletion(task.id)}
                  />
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {getTaskTitle(task.title)}
                    </h3>
                    {task.duration && (
                      <p className="text-sm text-gray-600">
                        {task.duration}
                      </p>
                    )}
                  </div>
                </div>
                {task.stars > 0 && (
                  <div className="flex">
                    {[...Array(task.stars)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};

import { AnalogClock } from "@/components/AnalogClock";
