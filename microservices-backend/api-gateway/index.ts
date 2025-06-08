import express from "express";
import { config } from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";

config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

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

app.use("/", apiLimiter as any);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
  })
);

app.use(
  "/api/tasks",
  createProxyMiddleware({
    target: process.env.TODOS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/tasks": "" },
  })
);

app.use(express.json() as any);
app.use(express.urlencoded({ extended: true }) as any);

app.listen(process.env.PORT || 5000, () => {
  console.log(`API Gateway is running on port ${process.env.PORT}`);
});
