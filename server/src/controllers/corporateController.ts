import { Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User";
import CorporateClient from "../models/CorporateClient";
import CorporateLearner from "../models/CorporateLearner";
import Enrollment from "../models/Enrollment";
import CourseModule from "../models/CourseModule";
import LessonProgress from "../models/LessonProgress";
import { AuthRequest } from "../middleware/auth";

const id = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const requireCorporate = async (req: AuthRequest) => {
  if (!req.user?.userId || req.user.role !== "client") return null;
  return CorporateClient.findOne({ user: req.user.userId, active: true }).lean();
};

const buildLearnerRows = async (clientId: mongoose.Types.ObjectId | string) => {
  const assignments = await CorporateLearner.find({ corporateClient: clientId, active: true })
    .populate("learner", "name email phone avatarUrl")
    .populate({
      path: "enrollment",
      populate: [
        { path: "course", select: "title slug technology level mode duration" },
        { path: "batch", select: "name startDate endDate schedule mode venue link status" },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  return Promise.all(assignments.map(async (assignment: any) => {
    const enrollment = assignment.enrollment;
    const learner = assignment.learner;
    if (!enrollment?._id || !enrollment.course?._id || !learner?._id) {
      return { ...assignment, totalLessons: 0, completedLessons: 0, progressPercentage: 0 };
    }

    const modules = await CourseModule.find({ course: enrollment.course._id, active: true }).lean();
    const totalLessons = modules.reduce(
      (sum: number, module: any) => sum + (module.lessons || []).filter((lesson: any) => lesson.active !== false).length,
      0,
    );
    const completedLessons = await LessonProgress.countDocuments({
      learner: learner._id,
      enrollment: enrollment._id,
      completed: true,
    });

    return {
      ...assignment,
      totalLessons,
      completedLessons,
      progressPercentage: totalLessons ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0,
    };
  }));
};

export const getCorporateDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await requireCorporate(req);
    if (!client) {
      res.status(403).json({ success: false, message: "Corporate client access required" });
      return;
    }

    const learners = await buildLearnerRows(client._id);
    const totalLearners = learners.length;
    const completedPrograms = learners.filter((item: any) => item.progressPercentage >= 100).length;
    const averageProgress = totalLearners
      ? Math.round(learners.reduce((sum: number, item: any) => sum + item.progressPercentage, 0) / totalLearners)
      : 0;
    const courseMap = new Map<string, { title: string; learners: number; averageProgress: number }>();

    for (const item of learners as any[]) {
      const course = item.enrollment?.course;
      if (!course?._id) continue;
      const key = String(course._id);
      const existing = courseMap.get(key) || { title: course.title, learners: 0, averageProgress: 0 };
      existing.learners += 1;
      existing.averageProgress += item.progressPercentage;
      courseMap.set(key, existing);
    }

    const courses = Array.from(courseMap.values()).map((course) => ({
      ...course,
      averageProgress: course.learners ? Math.round(course.averageProgress / course.learners) : 0,
    }));

    res.json({
      success: true,
      client,
      summary: { totalLearners, completedPrograms, averageProgress, activeLearners: learners.filter((item: any) => item.progressPercentage > 0 && item.progressPercentage < 100).length },
      courses,
      learners,
    });
  } catch (error) {
    console.error("Corporate dashboard error:", error);
    res.status(500).json({ success: false, message: "Failed to load corporate dashboard" });
  }
};

export const getCorporateLearner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await requireCorporate(req);
    const assignmentId = id(req.params.assignmentId);
    if (!client) { res.status(403).json({ success: false, message: "Corporate client access required" }); return; }
    if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) { res.status(400).json({ success: false, message: "Invalid learner assignment" }); return; }

    const rows = await buildLearnerRows(client._id);
    const learner = rows.find((item: any) => String(item._id) === assignmentId);
    if (!learner) { res.status(404).json({ success: false, message: "Assigned learner not found" }); return; }

    const progress = await LessonProgress.find({
      learner: (learner as any).learner._id,
      enrollment: (learner as any).enrollment._id,
    }).sort({ updatedAt: -1 }).lean();

    res.json({ success: true, learner, progress });
  } catch (error) {
    console.error("Corporate learner detail error:", error);
    res.status(500).json({ success: false, message: "Failed to load learner detail" });
  }
};

export const getCorporateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await requireCorporate(req);
    if (!client) { res.status(403).json({ success: false, message: "Corporate client access required" }); return; }
    const learners = await buildLearnerRows(client._id);
    res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      company: client.companyName,
      rows: learners.map((item: any) => ({
        learner: item.learner?.name || "",
        email: item.learner?.email || "",
        course: item.enrollment?.course?.title || "",
        batch: item.enrollment?.batch?.name || "",
        status: item.enrollment?.status || "",
        completedLessons: item.completedLessons,
        totalLessons: item.totalLessons,
        progressPercentage: item.progressPercentage,
      })),
    });
  } catch (error) {
    console.error("Corporate report error:", error);
    res.status(500).json({ success: false, message: "Failed to generate corporate report" });
  }
};

export const getAdminCorporateClients = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clients = await CorporateClient.find().populate("user", "name email isActive").sort({ createdAt: -1 }).lean();
    const data = await Promise.all(clients.map(async (client: any) => ({
      ...client,
      learnerCount: await CorporateLearner.countDocuments({ corporateClient: client._id, active: true }),
    })));
    res.json({ success: true, clients: data });
  } catch (error) {
    console.error("Admin corporate clients error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch corporate clients" });
  }
};

export const createAdminCorporateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { companyName, contactName, email, password } = req.body;
    if (!companyName || !contactName || !email || !password) {
      res.status(400).json({ success: false, message: "Company, contact name, email and password are required" }); return;
    }
    if (String(password).length < 6) { res.status(400).json({ success: false, message: "Password must be at least 6 characters" }); return; }
    const normalizedEmail = String(email).toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) { res.status(409).json({ success: false, message: "A user with this email already exists" }); return; }
    const user = await User.create({ name: String(contactName).trim(), email: normalizedEmail, password: await bcrypt.hash(String(password), 12), role: "client", permissions: [], isActive: true });
    const corporate = await CorporateClient.create({ user: user._id, companyName: String(companyName).trim(), contactName: String(contactName).trim(), contactEmail: normalizedEmail, active: true });
    res.status(201).json({ success: true, message: "Corporate account created", client: corporate, credentials: { email: normalizedEmail } });
  } catch (error) {
    console.error("Create corporate client error:", error);
    res.status(500).json({ success: false, message: "Failed to create corporate account" });
  }
};

export const getAdminCorporateEnrollments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assignedIds = await CorporateLearner.find({ active: true }).distinct("enrollment");
    const enrollments = await Enrollment.find({ status: { $in: ["paid", "active", "completed"] }, _id: { $nin: assignedIds } })
      .populate("learner", "name email")
      .populate("course", "title technology")
      .populate("batch", "name startDate endDate")
      .sort({ enrolledAt: -1 }).limit(200).lean();
    res.json({ success: true, enrollments });
  } catch (error) {
    console.error("Corporate enrollment options error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch assignable enrollments" });
  }
};

export const assignCorporateLearner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const corporateClientId = id(req.params.corporateClientId);
    const enrollmentId = id(req.body.enrollmentId);
    if (!corporateClientId || !enrollmentId || !mongoose.Types.ObjectId.isValid(corporateClientId) || !mongoose.Types.ObjectId.isValid(enrollmentId)) {
      res.status(400).json({ success: false, message: "Valid corporate client and enrollment are required" }); return;
    }
    const client = await CorporateClient.findById(corporateClientId);
    const enrollment: any = await Enrollment.findById(enrollmentId);
    if (!client || !client.active) { res.status(404).json({ success: false, message: "Corporate client not found" }); return; }
    if (!enrollment) { res.status(404).json({ success: false, message: "Enrollment not found" }); return; }
    const assignment = await CorporateLearner.create({ corporateClient: client._id, learner: enrollment.learner, enrollment: enrollment._id, active: true });
    res.status(201).json({ success: true, message: "Learner assigned", assignment });
  } catch (error: any) {
    if (error?.code === 11000) { res.status(409).json({ success: false, message: "This enrollment is already assigned" }); return; }
    console.error("Assign corporate learner error:", error);
    res.status(500).json({ success: false, message: "Failed to assign learner" });
  }
};

export const removeCorporateLearner = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const corporateClientId = id(req.params.corporateClientId);
    const assignmentId = id(req.params.assignmentId);
    if (!corporateClientId || !assignmentId || !mongoose.Types.ObjectId.isValid(corporateClientId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      res.status(400).json({ success: false, message: "Invalid corporate assignment" }); return;
    }
    const assignment = await CorporateLearner.findOneAndUpdate({ _id: assignmentId, corporateClient: corporateClientId }, { active: false }, { new: true });
    if (!assignment) { res.status(404).json({ success: false, message: "Assignment not found" }); return; }
    res.json({ success: true, message: "Learner removed from corporate program" });
  } catch (error) {
    console.error("Remove corporate learner error:", error);
    res.status(500).json({ success: false, message: "Failed to remove learner" });
  }
};
