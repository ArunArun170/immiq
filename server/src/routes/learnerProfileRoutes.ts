import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getLearnerProfile,
  updateLearnerProfile,
  changeLearnerPassword,
} from "../controllers/learnerProfileController";

const router = Router();

router.get("/learner/profile", authenticate, getLearnerProfile);
router.put("/learner/profile", authenticate, updateLearnerProfile);
router.post("/learner/profile/password", authenticate, changeLearnerPassword);

export default router;
