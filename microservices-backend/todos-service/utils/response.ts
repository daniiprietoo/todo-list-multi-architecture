import { Response } from "express";
import { TraceStep } from "./trace";

interface SendResponseOptions {
  success: boolean;
  message: string;
  data?: any;
  trace?: TraceStep[];
  requestId?: string;
  status?: number;
}

export function sendResponse(res: Response, options: SendResponseOptions) {
  const { success, message, data, requestId, status = 200, trace } = options;
  const responseBody: any = {
    success,
    message,
  };
  if (data !== undefined) responseBody.data = data;
  if (requestId) responseBody.requestId = requestId;
  if (trace) responseBody.trace = trace;
  res.status(status).json(responseBody);
}
