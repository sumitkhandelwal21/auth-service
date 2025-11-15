import { Request, Response, NextFunction } from "express";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100);

const store = new Map<string, { count: number; resetAt: number }>();

export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = "";
  if (Array.isArray(forwarded)) {
    ip = forwarded[0] ?? "";
  } else if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0]?.trim() ?? "";
  }
  const key = ip || req.ip || "unknown";
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 0, resetAt: now + windowMs });
  }

  const current = store.get(key)!;
  current.count += 1;

  const remaining = Math.max(max - current.count, 0);
  const resetSeconds = Math.ceil((current.resetAt - now) / 1000);

  res.setHeader("X-RateLimit-Limit", String(max));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(resetSeconds));

  if (current.count > max) {
    res.setHeader("Retry-After", String(resetSeconds));
    return res.status(429).json({ message: "Too many requests" });
  }

  next();
};
