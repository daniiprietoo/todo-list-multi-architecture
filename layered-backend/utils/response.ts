import { Response } from "express";

interface SendResponseOptions {
  success: boolean;
  message: string;
  data?: any;
  requestId?: string;
  status?: number;
}

export function sendResponse(res: Response, options: SendResponseOptions) {
  const { success, message, data, requestId, status = 200 } = options;
  const responseBody: any = {
    success,
    message,
  };
  if (data !== undefined) responseBody.data = data;
  if (requestId) responseBody.requestId = requestId;
  res.status(status).json(responseBody);
}
