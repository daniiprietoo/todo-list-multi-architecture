import { NewTodo, Todo } from "../schema/schema";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../repositories/tasks-repositories";
import { getUserById } from "../clients/user-service-client";
import { AppError, NotFoundError, ForbiddenError } from "../utils/errors";

export async function createTaskService(
  task: NewTodo,
  userId: number
): Promise<Todo> {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("❌ User not found");
  }
  const newTask = await createTask(task, userId);
  if (!newTask) {
    throw new AppError("❌ Failed to create task", 400);
  }
  return newTask;
}

export async function getTasksService(userId: number): Promise<Todo[]> {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("❌ User not found");
  }
  const tasks = await getTasks(userId);
  return tasks;
}

export async function getTaskByIdService(taskId: number): Promise<Todo> {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new NotFoundError("❌ Task not found");
  }
  return task;
}

export async function updateTaskService(
  updates: Partial<{ title: string; description: string; completed: boolean }>,
  taskId: number,
  userId: number
): Promise<Todo> {
  const existingTask = await getTaskById(taskId);
  if (!existingTask) {
    throw new NotFoundError("❌ Task not found");
  }
  if (existingTask.userId !== userId) {
    throw new ForbiddenError("❌ Unauthorized to update this task");
  }
  const updatedTask = await updateTask(updates, taskId);
  if (!updatedTask) {
    throw new NotFoundError("❌ Task not found or failed to update");
  }
  return updatedTask;
}

export async function deleteTaskService(taskId: number): Promise<void> {
  const existingTask = await getTaskById(taskId);
  if (!existingTask) {
    throw new NotFoundError("❌ Task not found");
  }
  const deleted = await deleteTask(taskId);
  if (!deleted) {
    throw new NotFoundError("❌ Task not found or failed to delete");
  }
  return;
}
