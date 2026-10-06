import { Router } from "express";

import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("blog:read"),
  getBlogPosts
);

router.get(
  "/:id",
  authenticate,
  requirePermission("blog:read"),
  getBlogPost
);

router.post(
  "/",
  authenticate,
  requirePermission("blog:create"),
  createBlogPost
);

router.put(
  "/:id",
  authenticate,
  requirePermission("blog:update"),
  updateBlogPost
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("blog:delete"),
  deleteBlogPost
);

export default router;