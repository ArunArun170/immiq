import { Router } from "express";

import {
  getPublicCourses,
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

/* =========================
   PUBLIC
   GET /api/v1/public/courses
========================= */

router.get(
  "/public/courses",
  getPublicCourses
);

/* =========================
   ADMIN
========================= */

router.get(
  "/admin/courses",
  authenticate,
  requirePermission("course:read"),
  getCourses
);

router.get(
  "/admin/courses/:id",
  authenticate,
  requirePermission("course:read"),
  getCourse
);

router.post(
  "/admin/courses",
  authenticate,
  requirePermission("course:create"),
  createCourse
);

router.put(
  "/admin/courses/:id",
  authenticate,
  requirePermission("course:update"),
  updateCourse
);

router.delete(
  "/admin/courses/:id",
  authenticate,
  requirePermission("course:delete"),
  deleteCourse
);

export default router;