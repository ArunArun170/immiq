import { Router } from "express";

import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("service:read"),
  getServices
);

router.get(
  "/:id",
  authenticate,
  requirePermission("service:read"),
  getService
);

router.post(
  "/",
  authenticate,
  requirePermission("service:create"),
  createService
);

router.put(
  "/:id",
  authenticate,
  requirePermission("service:update"),
  updateService
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("service:delete"),
  deleteService
);

export default router;