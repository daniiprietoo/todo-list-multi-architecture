import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { asyncHandler } from "./utils/asyncHandler";
import { errorHandler } from "./middleware/errorHandler";
import { NotFoundError } from "./utils/errors";
import { logger } from "./utils/logger";
import { v4 as uuidv4 } from "uuid";
import { rateLimit } from "express-rate-limit";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { sendResponse } from "./utils/response";

// Extend Express Request to include id
declare module "express-serve-static-core" {
  interface Request {
    id?: string;
  }
}

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = uuidv4();
  res.setHeader("X-Request-Id", req.id);
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", apiLimiter as any);

app.get("/", (req: Request, res: Response) => {
  logger.info(`[${req.id}] Health check`);
  sendResponse(res, {
    success: true,
    message: "✅ Server is running",
    requestId: req.id,
    status: 200,
  });
});

app.get(
  "/api/users/logout",
  asyncHandler(async (req: Request, res: Response) => {
    logger.info(`[${req.id}] User logged out`);
    sendResponse(res, {
      success: true,
      message: "✅ User logged out",
      requestId: req.id,
      status: 200,
    });
  })
);

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List API",
      version: "1.0.0",
      description:
        "API documentation for the Todo List Layered Architecture backend",
    },
    servers: [
      {
        url: "/api",
        description: "API server",
      },
    ],
  },
  apis: ["./controllers/*.ts", "./routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  "/api/docs",
  swaggerUi.serve as any,
  swaggerUi.setup(swaggerSpec) as any
);

// Catch-all 404 for /api/* routes
app.all(/^\/api\/.*/, (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("❌ Route not found"));
});

// Centralized error handler
app.use(errorHandler);

export default app;

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});
