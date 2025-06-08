import { Request, Response } from "express";
import {
  loginUserSchema,
  registerUserValidationSchema,
} from "../model/validation-schemas";
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import {
  loginUserService,
  registerUserService,
} from "../services/user-service";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";
import { sendResponse } from "../utils/response";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = registerUserValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      logger.error(`[${req.id}] Invalid input: ${parseResult.error.message}`);
      throw new ValidationError("❌ Invalid input");
    }

    try {
      const newUser = await registerUserService(parseResult.data);
      logger.info(`[${req.id}] User registered: ${newUser.email}`);
      sendResponse(res, {
        success: true,
        message: "✅ User registered successfully",
        data: newUser,
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
      } else if (error instanceof ConflictError) {
        logger.error(`[${req.id}] Conflict error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 409,
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

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = loginUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      logger.error(`[${req.id}] Invalid input: ${parseResult.error.message}`);
      throw new ValidationError("❌ Invalid input");
    }

    try {
      const user = await loginUserService(parseResult.data);
      logger.info(`[${req.id}] User logged in: ${user.email}`);
      sendResponse(res, {
        success: true,
        message: "✅ User logged in successfully",
        data: user,
        requestId: req.id,
        status: 200,
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
      } else if (error instanceof UnauthorizedError) {
        logger.error(`[${req.id}] Unauthorized error: ${error.message}`);
        sendResponse(res, {
          success: false,
          message: error.message,
          requestId: req.id,
          status: 401,
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

export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    sendResponse(res, {
      success: true,
      message: "✅ User logged out successfully",
    });
  }
);
