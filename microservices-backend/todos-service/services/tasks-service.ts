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
import { TraceContext } from "../utils/trace";

export async function createTaskService(
  task: NewTodo,
  userId: number,
  traceContext: TraceContext
): Promise<Todo> {
  const startTime = process.hrtime.bigint();

  const userCheckStart = process.hrtime.bigint();
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("❌ User not found");
  }
  const userCheckEnd = process.hrtime.bigint();
  const userCheckDuration = Number(userCheckEnd - userCheckStart) / 1e6;
  traceContext.addStep("Client: getUserById", userCheckDuration);

  const createTaskStart = process.hrtime.bigint();
  const newTask = await createTask(task, userId);
  if (!newTask) {
    throw new AppError("❌ Failed to create task", 400);
  }
  const createTaskEnd = process.hrtime.bigint();
  const createTaskDuration = Number(createTaskEnd - createTaskStart) / 1e6;
  traceContext.addStep("Repository: createTask", createTaskDuration);

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1e6;
  traceContext.addStep("Service: createTask", duration);
  return newTask;
}

export async function getTasksService(
  userId: number,
  traceContext: TraceContext
): Promise<Todo[]> {
  const startTime = process.hrtime.bigint();

  const userCheckStart = process.hrtime.bigint();
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError("❌ User not found");
  }
  const userCheckEnd = process.hrtime.bigint();
  const userCheckDuration = Number(userCheckEnd - userCheckStart) / 1e6;
  traceContext.addStep("Client: getUserById", userCheckDuration);

  const getTasksStart = process.hrtime.bigint();
  const tasks = await getTasks(userId);
  const getTasksEnd = process.hrtime.bigint();
  const getTasksDuration = Number(getTasksEnd - getTasksStart) / 1e6;
  traceContext.addStep("Repository: getTasks", getTasksDuration);

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1e6;
  traceContext.addStep("Service: getTasks", duration);

  return tasks;
}

export async function getTaskByIdService(
  taskId: number,
  traceContext: TraceContext
): Promise<Todo> {
  const startTime = process.hrtime.bigint();

  const getTaskByIdStart = process.hrtime.bigint();
  const task = await getTaskById(taskId);
  if (!task) {
    throw new NotFoundError("❌ Task not found");
  }
  const getTaskByIdEnd = process.hrtime.bigint();
  const getTaskByIdDuration = Number(getTaskByIdEnd - getTaskByIdStart) / 1e6;
  traceContext.addStep("Repository: getTaskById", getTaskByIdDuration);

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1e6;
  traceContext.addStep("Service: getTaskById", duration);
  return task;
}

export async function updateTaskService(
  updates: Partial<{ title: string; description: string; completed: boolean }>,
  taskId: number,
  userId: number,
  traceContext: TraceContext
): Promise<Todo> {
  const startTime = process.hrtime.bigint();

  const getTaskByIdStart = process.hrtime.bigint();
  const existingTask = await getTaskById(taskId);
  if (!existingTask) {
    throw new NotFoundError("❌ Task not found");
  }
  if (existingTask.userId !== userId) {
    throw new ForbiddenError("❌ Unauthorized to update this task");
  }
  const getTaskByIdEnd = process.hrtime.bigint();
  const getTaskByIdDuration = Number(getTaskByIdEnd - getTaskByIdStart) / 1e6;
  traceContext.addStep("Repository: getTaskById", getTaskByIdDuration);

  const updateTaskStart = process.hrtime.bigint();
  const updatedTask = await updateTask(updates, taskId);
  if (!updatedTask) {
    throw new NotFoundError("❌ Task not found or failed to update");
  }
  const updateTaskEnd = process.hrtime.bigint();
  const updateTaskDuration = Number(updateTaskEnd - updateTaskStart) / 1e6;
  traceContext.addStep("Repository: updateTask", updateTaskDuration);

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1e6;
  traceContext.addStep("Service: updateTask", duration);
  return updatedTask;
}

export async function deleteTaskService(
  taskId: number,
  traceContext: TraceContext
): Promise<void> {
  const startTime = process.hrtime.bigint();

  const getTaskByIdStart = process.hrtime.bigint();
  const existingTask = await getTaskById(taskId);
  if (!existingTask) {
    throw new NotFoundError("❌ Task not found");
  }
  const getTaskByIdEnd = process.hrtime.bigint();
  const getTaskByIdDuration = Number(getTaskByIdEnd - getTaskByIdStart) / 1e6;
  traceContext.addStep("Repository: getTaskById", getTaskByIdDuration);

  const deleteTaskStart = process.hrtime.bigint();
  const deleted = await deleteTask(taskId);
  if (!deleted) {
    throw new NotFoundError("❌ Task not found or failed to delete");
  }
  const deleteTaskEnd = process.hrtime.bigint();
  const deleteTaskDuration = Number(deleteTaskEnd - deleteTaskStart) / 1e6;
  traceContext.addStep("Repository: deleteTask", deleteTaskDuration);

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1e6;
  traceContext.addStep("Service: deleteTask", duration);
  return;
}
