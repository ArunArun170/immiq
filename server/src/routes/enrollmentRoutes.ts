import { Router } from "express";

import {
  createEnrollment,
  getMyEnrollments,
  getMyEnrollmentById,
} from "../controllers/enrollmentController";

import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * Learner enrollment
 */
router.post(
  "/enrollments",
  authenticate,
  createEnrollment
);

/**
 * Current learner enrollments
 */
router.get(
  "/enrollments/my",
  authenticate,
  getMyEnrollments
);

/**
 * Current learner enrollment details
 */
router.get(
  "/enrollments/my/:id",
  authenticate,
  getMyEnrollmentById
);

export default router;