import { Response } from "express";
import { AuthRequest } from "../middleware/auth";

export const adminDashboard = (
  req: AuthRequest,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    message: "Admin authentication successful",
    user: req.user,
  });
};