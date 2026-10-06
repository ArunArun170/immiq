import { Router } from "express";

import {
  getMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../controllers/mediaController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("media:read"),
  getMedia
);

router.get(
  "/:id",
  authenticate,
  requirePermission("media:read"),
  getMediaById
);

router.post(
  "/",
  authenticate,
  requirePermission("media:create"),
  createMedia
);

router.put(
  "/:id",
  authenticate,
  requirePermission("media:update"),
  updateMedia
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("media:delete"),
  deleteMedia
);

export default router;