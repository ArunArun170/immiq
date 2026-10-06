import crypto from "crypto";
import { Response } from "express";

import Enrollment from "../models/Enrollment";
import Certificate from "../models/Certificate";
import CourseModule from "../models/CourseModule";
import LessonProgress from "../models/LessonProgress";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

const getParam = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
};

const makeCertificateNumber = (): string =>
  `IMMIQ-${new Date().getFullYear()}-${crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase()}`;

const getCompletion = async (
  learnerId: string,
  enrollmentId: string,
  courseId: string
) => {
  const modules = await CourseModule.find({
    course: courseId,
    active: true,
  }).lean();

  const lessonIds = modules.flatMap((module) =>
    module.lessons
      .filter((lesson) => lesson.active)
      .map((lesson) => lesson._id)
  );

  const totalLessons = lessonIds.length;

  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      percentage: 0,
      completed: false,
    };
  }

  const completedLessons = await LessonProgress.countDocuments({
    learner: learnerId,
    enrollment: enrollmentId,
    lesson: { $in: lessonIds },
    completed: true,
  });

  const percentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return {
    totalLessons,
    completedLessons,
    percentage,
    completed: completedLessons >= totalLessons,
  };
};

export const generateCertificate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") {
      res.status(403).json({
        success: false,
        message: "Learner access required",
      });
      return;
    }

    const enrollmentId = getParam(req.params.enrollmentId);

    if (!enrollmentId) {
      res.status(400).json({
        success: false,
        message: "Enrollment ID is required",
      });
      return;
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      learner: req.user.userId,
    }).populate("course", "title");

    if (!enrollment) {
      res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
      return;
    }

    const course = enrollment.course as unknown as {
      _id: unknown;
      title?: string;
    };

    const courseId = String(course._id);
    const completion = await getCompletion(
      req.user.userId,
      String(enrollment._id),
      courseId
    );

    if (!completion.completed) {
      res.status(400).json({
        success: false,
        message: "Complete all lessons before generating your certificate",
        progress: completion,
      });
      return;
    }

    let certificate = await Certificate.findOne({
      enrollment: enrollment._id,
    });

    if (certificate?.status === "revoked") {
      res.status(409).json({
        success: false,
        message: "This certificate has been revoked. Please contact IMMIQ.",
      });
      return;
    }

    if (!certificate) {
      const learner = await User.findById(req.user.userId)
        .select("name")
        .lean();

      try {
        certificate = await Certificate.create({
          certificateNumber: makeCertificateNumber(),
          learner: req.user.userId,
          enrollment: enrollment._id,
          course: courseId,
          courseTitle: course.title || "IMMIQ Course",
          learnerName: learner?.name || "Learner",
          issuedAt: new Date(),
          status: "issued",
        });
      } catch (error: unknown) {
        const duplicate = await Certificate.findOne({
          enrollment: enrollment._id,
        });

        if (!duplicate) throw error;
        certificate = duplicate;
      }
    }

    res.json({
      success: true,
      certificate,
      progress: completion,
    });
  } catch (error) {
    console.error("Generate certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
    });
  }
};

export const getMyCertificates = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const certificates = await Certificate.find({
      learner: req.user.userId,
      status: "issued",
    })
      .sort({ issuedAt: -1 })
      .lean();

    res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

export const verifyCertificate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const certificateId = getParam(req.params.certificateId);

    if (!certificateId) {
      res.status(400).json({
        success: false,
        message: "Certificate number is required",
      });
      return;
    }

    const certificate = await Certificate.findOne({
      certificateNumber: certificateId,
      status: "issued",
    })
      .populate("course", "title")
      .lean();

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: "Certificate not found or revoked",
      });
      return;
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify certificate",
    });
  }
};

export const getAdminCertificates = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const certificates = await Certificate.find()
      .populate("learner", "name email")
      .populate("course", "title")
      .sort({ issuedAt: -1 })
      .lean();

    res.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Admin certificates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
    });
  }
};

export const revokeCertificate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const certificateId = getParam(req.params.certificateId);

    if (!certificateId) {
      res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
      return;
    }

    const certificate = await Certificate.findByIdAndUpdate(
      certificateId,
      { status: "revoked" },
      { new: true }
    );

    if (!certificate) {
      res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
      return;
    }

    res.json({
      success: true,
      certificate,
      message: "Certificate revoked successfully",
    });
  } catch (error) {
    console.error("Revoke certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to revoke certificate",
    });
  }
};
