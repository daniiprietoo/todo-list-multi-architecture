import { createInsertSchema } from "drizzle-zod";
import { users, todos } from "../schema/schema";
import { z } from "zod";

export const userInsertSchema = createInsertSchema(users);
export const todoInsertSchema = createInsertSchema(todos);

export const registerUserSchema = userInsertSchema
  .omit({ createdAt: true })
  .omit({ updatedAt: true })
  .omit({ id: true });

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createTaskSchema = todoInsertSchema.pick({
  title: true,
  description: true,
  userId: true,
});

export const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean().optional(),
  userId: z.number(),
});

export const deleteTaskSchema = z.object({
  taskId: z.number(),
  userId: z.number(),
});
