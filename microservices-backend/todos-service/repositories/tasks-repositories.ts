import db from "../drizzle";
import { todos, type Todo, type NewTodo } from "../schema/schema";
import { eq } from "drizzle-orm";

export async function createTask(
  task: NewTodo,
  userId: number
): Promise<Todo | null> {
  const { title, description } = task;
  const newTask = await db
    .insert(todos)
    .values({
      userId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  if (newTask.length === 0) {
    return null;
  }
  return newTask[0];
}

export async function getTasks(userId: number): Promise<Todo[]> {
  const tasks = await db.select().from(todos).where(eq(todos.userId, userId));
  return tasks;
}

export async function getTaskById(taskId: number): Promise<Todo | null> {
  const task = await db.select().from(todos).where(eq(todos.id, taskId));
  if (task.length === 0) {
    return null;
  }
  return task[0];
}

export async function updateTask(
  updates: Partial<{ title: string; description: string; completed: boolean }>,
  taskId: number
): Promise<Todo | null> {
  const updatedTask = await db
    .update(todos)
    .set(updates)
    .where(eq(todos.id, taskId))
    .returning();
  if (updatedTask.length === 0) {
    return null;
  }
  return updatedTask[0];
}

export async function deleteTask(taskId: number): Promise<boolean> {
  const result = await db.delete(todos).where(eq(todos.id, taskId)).returning();
  return result.length > 0;
}
