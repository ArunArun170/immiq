import { Router } from "express";

import { authenticate } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import { adminDashboard } from "../controllers/adminController";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  requireRoles("editor", "manager", "admin", "super_admin"),
  adminDashboard
);

export default router;