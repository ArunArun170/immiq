import { Router } from "express";
import {
  getPublicEvents,
  registerForEvent,
  cancelEventRegistration,
  getMyEventRegistrations,
} from "../controllers/eventController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/events", getPublicEvents);
router.get("/events/my", authenticate, getMyEventRegistrations);
router.post("/events/:eventId/register", authenticate, registerForEvent);
router.delete("/events/:eventId/register", authenticate, cancelEventRegistration);

export default router;
