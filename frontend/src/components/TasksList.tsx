import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export type Task = {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
  userId: number;
};

type TasksListProps = {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  className?: string;
};

export function TasksList({
  tasks,
  onEdit,
  onDelete,
  className,
}: TasksListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });

  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditData({ title: task.title, description: task.description });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = (task: Task) => {
    if (onEdit) {
      onEdit({ ...task, ...editData });
    }
    setEditingId(null);
  };

  const handleCompletedToggle = (task: Task) => {
    if (onEdit) {
      onEdit({ ...task, completed: !task.completed });
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {tasks.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-muted-foreground text-center py-4">
              No tasks yet.
            </div>
          </CardContent>
        </Card>
      )}
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={cn(
            "flex flex-row items-center gap-4",
            task.completed ? "opacity-60" : "opacity-100"
          )}
        >
          <CardContent className="flex-1 flex flex-col gap-2 py-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={() => handleCompletedToggle(task)}
                className="size-5 accent-primary"
                aria-label="Mark as completed"
              />
              {editingId === task.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="font-semibold text-lg"
                  />
                  <Input
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="text-base"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleEditSave(task)}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col w-full cursor-pointer"
                  onClick={() => handleEditClick(task)}
                >
                  <span className="font-semibold text-lg text-left line-clamp-1">
                    {task.title}
                  </span>
                  <span className="text-base text-muted-foreground text-left line-clamp-2">
                    {task.description}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="pr-4 flex items-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onDelete && onDelete(task.id)}
              aria-label="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
