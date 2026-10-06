import { Router } from "express";

import {
  getPublicBatches,
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batchController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

/* =========================
   PUBLIC
========================= */

router.get(
  "/public/batches",
  getPublicBatches
);

/* =========================
   ADMIN
========================= */

router.get(
  "/admin/batches",
  authenticate,
  requirePermission("batch:read"),
  getBatches
);

router.get(
  "/admin/batches/:id",
  authenticate,
  requirePermission("batch:read"),
  getBatchById
);

router.post(
  "/admin/batches",
  authenticate,
  requirePermission("batch:create"),
  createBatch
);

router.put(
  "/admin/batches/:id",
  authenticate,
  requirePermission("batch:update"),
  updateBatch
);

router.delete(
  "/admin/batches/:id",
  authenticate,
  requirePermission("batch:delete"),
  deleteBatch
);

export default router;