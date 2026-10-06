import { Router } from "express";
import { getLearnerCourseContent, completeLesson } from "../controllers/learningController";
import { authenticate } from "../middleware/auth";
const router=Router();
router.get("/learning/enrollments/:enrollmentId",authenticate,getLearnerCourseContent);
router.post("/learning/enrollments/:enrollmentId/lessons/:lessonId/complete",authenticate,completeLesson);
export default router;
