import { Router } from "express";
import { getResources, getMyResources } from "../controllers/resourceController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/resources", getResources);
router.get("/resources/my", authenticate, getMyResources);

export default router;
