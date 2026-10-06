import { Response } from "express";
import mongoose from "mongoose";
import Resource from "../models/Resource";
import Enrollment from "../models/Enrollment";
import { AuthRequest } from "../middleware/auth";

export const getResources = async (req: AuthRequest, res: Response) => {
  try {
    const course = typeof req.query.course === "string" ? req.query.course : undefined;
    const type = typeof req.query.type === "string" ? req.query.type : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const query: Record<string, unknown> = { active: true };
    if (course && mongoose.Types.ObjectId.isValid(course)) query.course = course;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .populate("course", "title slug")
      .lean();

    return res.json({ success: true, resources });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch resources" });
  }
};

export const getMyResources = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") {
      return res.status(403).json({ success: false, message: "Learner access required" });
    }

    const enrollments = await Enrollment.find({
      learner: req.user.userId,
      status: { $in: ["paid", "active", "completed"] },
      paymentStatus: "paid",
    })
      .select("course")
      .lean();

    const courseIds = enrollments.map((item) => item.course);

    const resources = await Resource.find({
      active: true,
      $or: [
        { course: null },
        ...(courseIds.length ? [{ course: { $in: courseIds } }] : []),
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .populate("course", "title slug")
      .lean();

    return res.json({ success: true, resources });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch your resources" });
  }
};
