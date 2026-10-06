import { Router } from "express";

import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("achievement:read"),
  getAchievements
);

router.post(
  "/",
  authenticate,
  requirePermission("achievement:create"),
  createAchievement
);

router.put(
  "/:id",
  authenticate,
  requirePermission("achievement:update"),
  updateAchievement
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("achievement:delete"),
  deleteAchievement
);

export default router;