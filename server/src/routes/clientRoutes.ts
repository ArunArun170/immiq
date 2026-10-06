import { Router } from "express";

import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("client:read"),
  getClients
);

router.post(
  "/",
  authenticate,
  requirePermission("client:create"),
  createClient
);

router.put(
  "/:id",
  authenticate,
  requirePermission("client:update"),
  updateClient
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("client:delete"),
  deleteClient
);

export default router;