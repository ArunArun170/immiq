import { Router } from "express";

import {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  getAdminCertificates,
  revokeCertificate,
} from "../controllers/certificateController";

import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.post(
  "/certificates/generate/:enrollmentId",
  authenticate,
  generateCertificate
);

router.get(
  "/certificates/my",
  authenticate,
  getMyCertificates
);

router.get(
  "/certificates/verify/:certificateId",
  verifyCertificate
);

router.get(
  "/admin/certificates",
  authenticate,
  requirePermission("certificate:read"),
  getAdminCertificates
);

router.patch(
  "/admin/certificates/:certificateId/revoke",
  authenticate,
  requirePermission("certificate:update"),
  revokeCertificate
);

export default router;
