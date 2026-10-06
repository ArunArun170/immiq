import { Router } from "express";

const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("testimonial:read"),
  getTestimonials
);

router.get(
  "/:id",
  authenticate,
  requirePermission("testimonial:read"),
  getTestimonial
);

router.post(
  "/",
  authenticate,
  requirePermission("testimonial:create"),
  createTestimonial
);

router.put(
  "/:id",
  authenticate,
  requirePermission("testimonial:update"),
  updateTestimonial
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("testimonial:delete"),
  deleteTestimonial
);

export default router;