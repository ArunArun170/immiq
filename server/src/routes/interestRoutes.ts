import { Router } from "express";
import { submitInterest } from "../controllers/interestController";
import { authenticate } from "../middleware/auth";
const router=Router();
router.post("/interest-finder",submitInterest);
router.post("/interest-finder/authenticated",authenticate,submitInterest);
export default router;
