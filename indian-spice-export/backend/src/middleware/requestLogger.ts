import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const user = req.user ? `[User: ${req.user.email} (${req.user.role})]` : "";

    // Highlight errors in output
    const statusIndicator = status >= 500 ? "🔴" : status >= 400 ? "🟡" : "🟢";
    console.log(
      `[HTTP] ${statusIndicator} ${method} ${originalUrl} ${status} - ${duration}ms - IP: ${ip} ${user}`
    );
  });

  next();
}
