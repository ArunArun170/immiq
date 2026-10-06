import { Router } from "express";

import {
  getLeads,
  getLead,
  updateLead,
} from "../controllers/leadController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("lead:read"),
  getLeads
);

router.get(
  "/:id",
  authenticate,
  requirePermission("lead:read"),
  getLead
);

router.put(
  "/:id",
  authenticate,
  requirePermission("lead:update"),
  updateLead
);

export default router;