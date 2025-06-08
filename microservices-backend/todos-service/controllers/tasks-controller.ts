import {
  createTaskValidationSchema,
  deleteTaskValidationSchema,
  updateTaskValidationSchema,
} from "../model/validation-schemas";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
  getTaskByIdService,
} from "../services/tasks-service";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = createTaskValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError("❌ Invalid input");
    }

    const { title, description, userId } = parseResult.data;

    try {
      const newTask = await createTaskService(
        { title, description, userId },
        userId
      );
      logger.info(`[${req.id}] Task created: ${newTask.title}`);
      sendResponse(res, {
        success: true,
        message: "✅ Task created successfully",
        data: newTask,
        requestId: req.id,
        status: 201,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.error(`[${req.id}] Validation error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 400,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 404,
        });
      } else {
        logger.error(
          `[${req.id}] Internal server error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        sendResponse(res, {
          success: false,
          message: "Internal server error",
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      throw new ValidationError("❌ Missing userId");
    }

    try {
      const tasks = await getTasksService(userId);
      logger.info(`[${req.id}] Tasks fetched: ${tasks.length}`);
      sendResponse(res, {
        success: true,
        message: "✅ Tasks fetched successfully",
        data: tasks,
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 404,
        });
      } else {
        logger.error(
          `[${req.id}] Internal server error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        sendResponse(res, {
          success: false,
          message: "Internal server error",
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const request = {
      ...req.body,
      id: taskId,
    };

    const parseResult = updateTaskValidationSchema.safeParse(request);
    if (!parseResult.success) {
      throw new ValidationError("❌ Invalid input");
    }

    const { id, title, description, completed, userId } = parseResult.data;

    try {
      const existingTask = await getTaskByIdService(taskId);
      if (existingTask.userId !== userId) {
        throw new ForbiddenError("❌ Unauthorized to update this task");
      }
      const updatedTask = await updateTaskService(
        { title, description, completed },
        taskId,
        userId
      );
      logger.info(`[${req.id}] Task updated: ${updatedTask.title}`);
      sendResponse(res, {
        success: true,
        message: "✅ Task updated successfully",
        data: updatedTask,
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        logger.error(`[${req.id}] Forbidden error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 403,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 404,
        });
      } else {
        logger.error(
          `[${req.id}] Internal server error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        sendResponse(res, {
          success: false,
          message: "Internal server error",
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const parseResult = deleteTaskValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError("❌ Invalid input");
    }

    const { userId } = parseResult.data;

    try {
      const existingTask = await getTaskByIdService(taskId);
      if (existingTask.userId !== userId) {
        throw new ForbiddenError("❌ Unauthorized to delete this task");
      }
      await deleteTaskService(taskId);
      logger.info(`[${req.id}] Task deleted: ${taskId}`);
      sendResponse(res, {
        success: true,
        message: "✅ Task deleted successfully",
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        logger.error(`[${req.id}] Forbidden error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 403,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 404,
        });
      } else {
        logger.error(
          `[${req.id}] Internal server error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        sendResponse(res, {
          success: false,
          message: "Internal server error",
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);
