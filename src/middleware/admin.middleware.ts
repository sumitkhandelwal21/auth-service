import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;
  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
