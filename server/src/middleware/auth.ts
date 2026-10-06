import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    permissions: string[];
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};