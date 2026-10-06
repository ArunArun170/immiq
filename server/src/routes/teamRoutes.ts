import { Router } from "express";

import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("team:read"),
  getTeamMembers
);

router.get(
  "/:id",
  authenticate,
  requirePermission("team:read"),
  getTeamMember
);

router.post(
  "/",
  authenticate,
  requirePermission("team:create"),
  createTeamMember
);

router.put(
  "/:id",
  authenticate,
  requirePermission("team:update"),
  updateTeamMember
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("team:delete"),
  deleteTeamMember
);

export default router;