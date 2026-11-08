import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        return callback(new Error("CORS policy violation"), false);
      },
      credentials: true,
    })
  );

  // Rate Limiting
  app.use("/api", generalLimiter);

  // Body Parsers with reasonable payload limits
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // Request Logging
  app.use(requestLogger);

  // Mount API Router
  app.use("/api", apiRouter);

  // 404 Handler for undefined API routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      },
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
