import { Router } from "express";
import {
  getCorporateDashboard,
  getCorporateLearner,
  getCorporateReport,
  getAdminCorporateClients,
  createAdminCorporateClient,
  getAdminCorporateEnrollments,
  assignCorporateLearner,
  removeCorporateLearner,
} from "../controllers/corporateController";
import { authenticate } from "../middleware/auth";
import { requirePermission } from "../middleware/rbac";

const router = Router();

router.get("/corporate/dashboard", authenticate, getCorporateDashboard);
router.get("/corporate/learners/:assignmentId", authenticate, getCorporateLearner);
router.get("/corporate/report", authenticate, getCorporateReport);

router.get("/admin/corporate", authenticate, requirePermission("client:read"), getAdminCorporateClients);
router.post("/admin/corporate", authenticate, requirePermission("client:create"), createAdminCorporateClient);
router.get("/admin/corporate/enrollments", authenticate, requirePermission("client:read"), getAdminCorporateEnrollments);
router.post("/admin/corporate/:corporateClientId/learners", authenticate, requirePermission("client:update"), assignCorporateLearner);
router.delete("/admin/corporate/:corporateClientId/learners/:assignmentId", authenticate, requirePermission("client:update"), removeCorporateLearner);

export default router;
