import { createInsertSchema } from "drizzle-zod";
import { users, todos } from "../schema/schema";
import { z } from "zod";

export const userInsertSchema = createInsertSchema(users);
export const todoInsertSchema = createInsertSchema(todos);

export const registerUserValidationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  passwordConfirmation: z.string().min(8),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createTaskValidationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  userId: z.number(),
});

export const updateTaskValidationSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean().optional(),
  userId: z.number(),
});

export const updateTaskCompletionValidationSchema = z.object({
  taskId: z.number(),
  completed: z.boolean(),
  userId: z.number(),
});

export const deleteTaskValidationSchema = z.object({
  userId: z.number(),
});
