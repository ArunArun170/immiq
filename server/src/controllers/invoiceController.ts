import { Response } from "express";
import { Types } from "mongoose";

import Enrollment from "../models/Enrollment";
import Invoice from "../models/Invoice";
import PaymentTransaction from "../models/PaymentTransaction";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

const makeInvoiceNumber = (id: string): string =>
  `INV-${new Date().getFullYear()}-${id.slice(-8).toUpperCase()}`;

const isStaff = (role?: string): boolean =>
  ["admin", "manager", "super_admin"].includes(role || "");

const ensureInvoiceForEnrollment = async (
  enrollment: any,
  learnerId: string
) => {
  if (enrollment.paymentStatus !== "paid") {
    return null;
  }

  const existing = await Invoice.findOne({
    enrollment: enrollment._id,
  });

  if (existing) {
    return existing;
  }

  const course =
    enrollment.course && typeof enrollment.course === "object"
      ? enrollment.course
      : null;

  const learner = await User.findById(learnerId)
    .select("name email")
    .lean();

  try {
    return await Invoice.create({
      invoiceNumber: makeInvoiceNumber(String(enrollment._id)),
      learner: learnerId,
      enrollment: enrollment._id,
      course: course?._id || enrollment.course,
      courseTitle: course?.title || "IMMIQ Course",
      amount: Number(enrollment.amount || 0),
      currency: "INR",
      paymentStatus: "paid",
      paymentId: enrollment.paymentId || "",
      orderId: "",
      billingName: learner?.name || "Learner",
      billingEmail: learner?.email || "",
      issuedAt: enrollment.enrolledAt || new Date(),
      paidAt: enrollment.updatedAt || new Date(),
    });
  } catch (error: unknown) {
    const duplicate = await Invoice.findOne({
      enrollment: enrollment._id,
    });

    if (duplicate) {
      return duplicate;
    }

    throw error;
  }
};

export const getMyInvoices = async (
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

    const paidEnrollments = await Enrollment.find({
      learner: req.user.userId,
      paymentStatus: "paid",
    })
      .populate("course", "title")
      .sort({ enrolledAt: -1 })
      .lean();

    for (const enrollment of paidEnrollments) {
      await ensureInvoiceForEnrollment(
        enrollment,
        req.user.userId
      );
    }

    const invoices = await Invoice.find({
      learner: req.user.userId,
    })
      .sort({ issuedAt: -1 })
      .lean();

    const transactions = await PaymentTransaction.find({
      learner: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      invoices,
      transactions,
    });
  } catch (error) {
    console.error("Get learner invoices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices and payment history",
    });
  }
};

export const getMyInvoiceById = async (
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

    const invoiceId = String(req.params.invoiceId || "");

    if (!Types.ObjectId.isValid(invoiceId)) {
      res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
      return;
    }

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      learner: req.user.userId,
    })
      .populate("course", "title slug")
      .populate("enrollment", "amount paymentStatus paymentId enrolledAt")
      .lean();

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
      return;
    }

    const transactions = await PaymentTransaction.find({
      learner: req.user.userId,
      invoiceNumber: invoice.invoiceNumber,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      invoice,
      transactions,
    });
  } catch (error) {
    console.error("Get invoice detail error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
};

export const getAdminInvoices = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!isStaff(req.user?.role)) {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    const invoices = await Invoice.find()
      .populate("learner", "name email")
      .populate("course", "title")
      .sort({ issuedAt: -1 })
      .lean();

    const transactions = await PaymentTransaction.find()
      .populate("learner", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json({
      success: true,
      invoices,
      transactions,
    });
  } catch (error) {
    console.error("Admin invoices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};
