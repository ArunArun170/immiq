import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth";

export const requireRoles =
  (...allowedRoles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };

export const requirePermission =
  (permission: string) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (
      req.user.role !== "super_admin" &&
      !req.user.permissions.includes(permission)
    ) {
      res.status(403).json({
        success: false,
        message: `Missing permission: ${permission}`,
      });
      return;
    }

    next();
  };