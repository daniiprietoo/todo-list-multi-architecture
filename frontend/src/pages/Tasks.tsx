import { getTasks, updateTask, deleteTask } from "@/api/api";
import { CreateTaskForm } from "@/components/create-task-form";
import { useUser } from "@/hooks/user";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TasksList } from "@/components/tasks-list";
import type { Task } from "@/components/tasks-list";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArchitectureSelector } from "@/components/ArchitectureSelector";
import { useArchitectureContext } from "@/hooks/architecture-context";

export default function Tasks() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { architecture, setArchitecture } = useArchitectureContext();

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    }
  }, [user, navigate]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    const response = await getTasks(user.id, architecture);
    if (response.success) {
      setTasks(response.tasks);
    } else {
      toast.error(response.error || "Failed to fetch tasks");
    }
  }, [user, architecture]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEditTask = async (task: Task) => {
    if (!user?.id) return;
    const response = await updateTask(
      {
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed ?? false,
        userId: user.id,
      },
      architecture
    );
    if (!response.success) {
      toast.error(response.error || "Failed to update task");
    } else {
      toast.success("Task updated successfully");
    }
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user?.id) return;
    const response = await deleteTask(taskId, user.id, architecture);
    if (!response.success) {
      toast.error(response.error || "Failed to delete task");
    } else {
      toast.success("Task deleted successfully");
      fetchTasks();
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}! 🎉</h1>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
          <ArchitectureSelector
            selected={architecture}
            onSelect={setArchitecture}
          />
        </div>
        <CreateTaskForm
          userId={user?.id as number}
          onTaskCreated={() => {
            fetchTasks();
          }}
          architecture={architecture}
        />
        <div className="mt-8">
          <TasksList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  );
}
