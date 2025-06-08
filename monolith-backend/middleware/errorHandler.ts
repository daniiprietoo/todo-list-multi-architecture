import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(
    `${req.method} ${req.originalUrl} - ${err.status || 500} - ${err.message}`,
    {
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    }
  );
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
