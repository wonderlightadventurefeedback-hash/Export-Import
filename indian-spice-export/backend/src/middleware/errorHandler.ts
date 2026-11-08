import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  // Prevent leaking internal stack traces or database errors
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "An unexpected error occurred while processing the request."
      : err.message || "Internal server error";

  console.error(`[API Error] ${req.method} ${req.url} [${statusCode}]:`, err.message);

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
}
