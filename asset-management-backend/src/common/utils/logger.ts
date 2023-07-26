// Logger package
import * as pino from "pino";

// Log level
let logLevel = process.env.LOG_LEVEL || "debug";

export const logger = pino({
  level: logLevel,
  name: "blocommerce-asset-management-backend",
});
