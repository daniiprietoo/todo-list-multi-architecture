import { z } from "zod";

export const createUserSchema = z.object({
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
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  userId: z.number(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean().optional(),
  userId: z.number(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export type User = {
  id: number;
  name: string;
  email: string;
};
