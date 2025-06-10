import {
  createTaskSchema,
  createUserSchema,
  loginUserSchema,
  updateTaskSchema,
  type CreateTaskSchema,
  type CreateUserSchema,
  type LoginUserSchema,
  type UpdateTaskSchema,
} from "@/lib/schemas";
import axios from "axios";
import type { Architecture } from "@/components/architecture-selector";

// Map architecture to API base URL
function getApi(architecture: Architecture) {
  let baseURL = `${import.meta.env.VITE_MICROSERVICES_API_URL}/api`;
  if (architecture === "monolith") {
    baseURL = `${import.meta.env.VITE_MONOLITH_API_URL}/api`;
  } else if (architecture === "layered") {
    baseURL = `${import.meta.env.VITE_LAYERED_API_URL}/api`;
  } else if (architecture === "microservices") {
    baseURL = `${import.meta.env.VITE_MICROSERVICES_API_URL}/api`;
  }
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function registerUser(
  user: CreateUserSchema,
  architecture: Architecture
) {
  const validatedUser = createUserSchema.safeParse(user);
  if (!validatedUser.success) {
    return {
      success: false,
      error: `Validation failed: ${validatedUser.error.message}`,
    };
  }
  try {
    const data = {
      name: validatedUser.data.name,
      email: validatedUser.data.email,
      password: validatedUser.data.password,
      passwordConfirmation: validatedUser.data.passwordConfirmation,
    };
    const api = getApi(architecture);
    const response = await api.post("/users/register", data);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
    };
  }
}

export async function loginUser(
  user: LoginUserSchema,
  architecture: Architecture
) {
  const validatedUser = loginUserSchema.safeParse(user);
  if (!validatedUser.success) {
    return {
      success: false,
      error: `Validation failed: ${validatedUser.error.message}`,
    };
  }
  try {
    const api = getApi(architecture);
    const response = await api.post("/users/login", validatedUser.data);
    return {
      success: response.data.success,
      message: response.data.message,
      user: response.data.data,
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
    };
  }
}

export async function createTask(
  task: CreateTaskSchema,
  architecture: Architecture
) {
  const validatedTask = createTaskSchema.safeParse(task);
  if (!validatedTask.success) {
    return {
      success: false,
      error: `Validation failed: ${validatedTask.error.message}`,
    };
  }
  try {
    const api = getApi(architecture);
    const response = await api.post("/tasks", validatedTask.data);
    return {
      success: response.data.success,
      message: response.data.message,
      trace: response.data.trace ?? [],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
      trace: [],
    };
  }
}

export async function updateTask(
  task: UpdateTaskSchema,
  architecture: Architecture
) {
  const validatedTask = updateTaskSchema.safeParse(task);
  if (!validatedTask.success) {
    return {
      success: false,
      error: `Validation failed: ${validatedTask.error.message}`,
    };
  }
  try {
    const { id, title, description, completed, userId } = validatedTask.data;
    const api = getApi(architecture);
    const response = await api.patch(`/tasks/${id}`, {
      title,
      description,
      completed,
      userId,
    });
    return {
      success: response.data.success,
      message: response.data.message,
      trace: response.data.trace ?? [],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
      trace: [],
    };
  }
}

export async function deleteTask(
  taskId: number,
  userId: number,
  architecture: Architecture
) {
  try {
    const api = getApi(architecture);
    const response = await api.delete(`/tasks/${taskId}`, { data: { userId } });
    return {
      success: response.data.success,
      message: response.data.message,
      trace: response.data.trace ?? [],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
      trace: [],
    };
  }
}

export async function getTasks(userId: number, architecture: Architecture) {
  try {
    const api = getApi(architecture);
    const response = await api.get(`/tasks/${userId}`);
    return {
      success: response.data.success,
      tasks: response.data.data ?? [],
      trace: response.data.trace ?? [],
    };
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-expect-error: dynamic error shape
      message = error.response?.data?.message || error.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      error: message,
      trace: [],
    };
  }
}
