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
import { TraceContext } from "../utils/trace";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceContext = new TraceContext();

    const parseResult = createTaskValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError("❌ Invalid input");
    }

    const { title, description, userId } = parseResult.data;

    try {
      const startTime = process.hrtime.bigint();
      const newTask = await createTaskService(
        { title, description, userId },
        userId,
        traceContext
      );
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1e6;
      logger.info(
        `[${req.id}] Task created: ${newTask.title} in ${duration} nanoseconds`
      );

      traceContext.addStep("Controller: createTask", duration);
      sendResponse(res, {
        success: true,
        message: "✅ Task created successfully",
        data: newTask,
        trace: traceContext.requestTrace,
        requestId: req.id,
        status: 201,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.error(`[${req.id}] Validation error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 400,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
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
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const getTasksController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceContext = new TraceContext();
    const userId = parseInt(req.params.userId);
    if (!userId) {
      throw new ValidationError("❌ Missing userId");
    }

    try {
      const startTime = process.hrtime.bigint();
      const tasks = await getTasksService(userId, traceContext);
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1e6;
      logger.info(
        `[${req.id}] Tasks fetched: ${tasks.length} in ${duration} nanoseconds`
      );
      traceContext.addStep("Controller: getTasks", duration);
      sendResponse(res, {
        success: true,
        message: "✅ Tasks fetched successfully",
        data: tasks,
        trace: traceContext.requestTrace,
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
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
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const updateTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceContext = new TraceContext();
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
      const startTime = process.hrtime.bigint();
      const existingTask = await getTaskByIdService(taskId, traceContext);
      if (existingTask.userId !== userId) {
        throw new ForbiddenError("❌ Unauthorized to update this task");
      }
      const updatedTask = await updateTaskService(
        { title, description, completed },
        taskId,
        userId,
        traceContext
      );
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1e6;
      logger.info(
        `[${req.id}] Task updated: ${updatedTask.title} in ${duration} nanoseconds`
      );
      traceContext.addStep("Controller: updateTask", duration);
      sendResponse(res, {
        success: true,
        message: "✅ Task updated successfully",
        data: updatedTask,
        trace: traceContext.requestTrace,
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        logger.error(`[${req.id}] Forbidden error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 403,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
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
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);

export const deleteTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const traceContext = new TraceContext();
    const taskId = parseInt(req.params.taskId);
    const parseResult = deleteTaskValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError("❌ Invalid input");
    }

    const { userId } = parseResult.data;

    try {
      const startTime = process.hrtime.bigint();
      const existingTask = await getTaskByIdService(taskId, traceContext);
      if (existingTask.userId !== userId) {
        throw new ForbiddenError("❌ Unauthorized to delete this task");
      }
      await deleteTaskService(taskId, traceContext);
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1e6;
      logger.info(
        `[${req.id}] Task deleted: ${taskId} in ${duration} nanoseconds`
      );
      traceContext.addStep("Controller: deleteTask", duration);
      sendResponse(res, {
        success: true,
        message: "✅ Task deleted successfully",
        trace: traceContext.requestTrace,
        requestId: req.id,
        status: 200,
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        logger.error(`[${req.id}] Forbidden error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 403,
        });
      } else if (error instanceof NotFoundError) {
        logger.error(`[${req.id}] Not found error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          trace: traceContext.requestTrace,
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
          trace: traceContext.requestTrace,
          requestId: req.id,
          status: 500,
        });
      }
    }
  }
);
