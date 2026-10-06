import mongoose from "mongoose";
import Enrollment from "../models/Enrollment";
import Course from "../models/Course";
import Batch from "../models/Batch";
import { AuthRequest } from "../middleware/auth";

/**
 * Create a new course enrollment
 *
 * POST /api/v1/enrollments
 */
export const createEnrollment = async (
  req: AuthRequest,
  res: any
) => {
  const session = await mongoose.startSession();

  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== "learner") {
      return res.status(403).json({
        message: "Only learners can enroll in courses",
      });
    }

    const { courseId, batchId } = req.body;

    if (!courseId || !batchId) {
      return res.status(400).json({
        message: "courseId and batchId are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(batchId)
    ) {
      return res.status(400).json({
        message: "Invalid courseId or batchId",
      });
    }

    session.startTransaction();

    const course = await Course.findById(courseId).session(
      session
    );

    if (!course) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Course not found",
      });
    }

    const batch = await Batch.findById(batchId).session(
      session
    );

    if (!batch) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // Make sure the selected batch belongs to the selected course
    if (String(batch.course) !== String(course._id)) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          "Selected batch does not belong to the selected course",
      });
    }

    // Only upcoming/running batches can accept enrollments
    if (
      batch.status !== "upcoming" &&
      batch.status !== "running"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          "This batch is not currently accepting enrollments",
      });
    }

    // Check seat availability
    const seatsTotal = Number(batch.seatsTotal) || 0;
    const seatsFilled = Number(batch.seatsFilled) || 0;

    if (seatsFilled >= seatsTotal) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "This batch is full",
      });
    }

    // Prevent duplicate enrollment
    const existingEnrollment =
      await Enrollment.findOne({
        learner: req.user.userId,
        batch: batch._id,
      }).session(session);

    if (existingEnrollment) {
      await session.abortTransaction();

      return res.status(409).json({
        message:
          "You are already enrolled in this batch",
        enrollment: existingEnrollment,
      });
    }

    /*
     * Calculate enrollment amount.
     *
     * Priority:
     * 1. Batch priceOverride
     * 2. Course fee
     */
    const courseFee =
      Number(course.fee) || 0;

    const batchPriceOverride =
      Number(batch.priceOverride) || 0;

    const amount =
      batchPriceOverride > 0
        ? batchPriceOverride
        : courseFee;

    const [enrollment] =
      await Enrollment.create(
        [
          {
            learner: req.user.userId,
            course: course._id,
            batch: batch._id,
            amount,
            status: "pending",
            paymentStatus: "pending",
            paymentId: "",
            enrolledAt: new Date(),
          },
        ],
        {
          session,
        }
      );

    // Reserve one seat
    batch.seatsFilled = seatsFilled + 1;

    await batch.save({
      session,
    });

    await session.commitTransaction();

    const populatedEnrollment =
      await Enrollment.findById(
        enrollment._id
      )
        .populate(
          "course",
          "title slug tagline technology level mode duration fee mrp gstPercent coverImage"
        )
        .populate(
          "batch",
          "name startDate endDate schedule mode venue link seatsTotal seatsFilled priceOverride earlyBirdTill status"
        );

    return res.status(201).json({
      message: "Enrollment created successfully",
      enrollment: populatedEnrollment,
    });
  } catch (error: any) {
    try {
      await session.abortTransaction();
    } catch {
      // Transaction may already be completed
    }

    console.error(
      "Create enrollment error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create enrollment",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error?.message,
    });
  } finally {
    await session.endSession();
  }
};

/**
 * Get logged-in learner enrollments
 *
 * GET /api/v1/enrollments/my
 */
export const getMyEnrollments = async (
  req: AuthRequest,
  res: any
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== "learner") {
      return res.status(403).json({
        message:
          "Only learners can access enrollments",
      });
    }

    const enrollments =
      await Enrollment.find({
        learner: req.user.userId,
      })
        .populate(
          "course",
          "title slug tagline technology level mode duration fee mrp gstPercent coverImage"
        )
        .populate(
          "batch",
          "name startDate endDate schedule mode venue link seatsTotal seatsFilled priceOverride earlyBirdTill status"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      enrollments,
    });
  } catch (error: any) {
    console.error(
      "Get learner enrollments error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch enrollments",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error?.message,
    });
  }
};

/**
 * Get one enrollment belonging to logged-in learner
 *
 * GET /api/v1/enrollments/my/:id
 */
export const getMyEnrollmentById = async (
  req: AuthRequest,
  res: any
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== "learner") {
      return res.status(403).json({
        message:
          "Only learners can access enrollments",
      });
    }

    const rawId = req.params.id;

    const id = Array.isArray(rawId)
      ? rawId[0]
      : rawId;

    if (!id) {
      return res.status(400).json({
        message: "Enrollment ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid enrollment ID",
      });
    }

    const enrollment =
      await Enrollment.findOne({
        _id: id,
        learner: req.user.userId,
      })
        .populate(
          "course",
          "title slug tagline technology level mode duration fee mrp gstPercent coverImage"
        )
        .populate(
          "batch",
          "name startDate endDate schedule mode venue link seatsTotal seatsFilled priceOverride earlyBirdTill status"
        );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    return res.status(200).json({
      enrollment,
    });
  } catch (error: any) {
    console.error(
      "Get learner enrollment error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch enrollment",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error?.message,
    });
  }
};