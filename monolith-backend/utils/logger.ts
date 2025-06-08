import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  defaultMeta: {
    service: "monolith-backend",
  },
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    // Add file transports here if needed
  ],
});
