import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("user:read"),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  requirePermission("user:read"),
  getUserById
);

router.post(
  "/",
  authenticate,
  requirePermission("user:create"),
  createUser
);

router.put(
  "/:id",
  authenticate,
  requirePermission("user:update"),
  updateUser
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("user:delete"),
  deleteUser
);

export default router;