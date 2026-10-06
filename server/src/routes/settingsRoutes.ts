import { Router } from "express";

import {
  getSettings,
  getPublicSettings,
  updateSettings,
} from "../controllers/settingsController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

/*
 * PUBLIC
 * Used by website SEO / Navbar / Footer
 */
router.get(
  "/public",
  getPublicSettings
);

/*
 * ADMIN
 */
router.get(
  "/",
  authenticate,
  requirePermission("settings:read"),
  getSettings
);

router.put(
  "/",
  authenticate,
  requirePermission("settings:update"),
  updateSettings
);

export default router;