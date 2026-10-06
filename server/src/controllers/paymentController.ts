import crypto from "crypto";
import { Request, Response } from "express";

import razorpay from "../config/razorpay";
import Enrollment from "../models/Enrollment";
import PaymentTransaction from "../models/PaymentTransaction";
import Invoice from "../models/Invoice";
import User from "../models/User";

const getAuthenticatedUserId = (req: Request) => {
  const authUser = (req as any).user;

  return (
    authUser?.id ||
    authUser?._id ||
    authUser?.userId ||
    authUser?.sub ||
    null
  );
};

const makeInvoiceNumber = (id: string): string =>
  `INV-${new Date().getFullYear()}-${id.slice(-8).toUpperCase()}`;

const createOrGetInvoice = async (
  enrollment: any,
  learnerId: string,
  paymentId: string,
  orderId: string
) => {
  const existing = await Invoice.findOne({
    enrollment: enrollment._id,
  });

  if (existing) {
    return existing;
  }

  const learner = await User.findById(learnerId)
    .select("name email")
    .lean();

  const course =
    enrollment.course && typeof enrollment.course === "object"
      ? enrollment.course
      : null;

  try {
    return await Invoice.create({
      invoiceNumber: makeInvoiceNumber(
        String(enrollment._id)
      ),
      learner: learnerId,
      enrollment: enrollment._id,
      course: course?._id || enrollment.course,
      courseTitle: course?.title || "IMMIQ Course",
      amount: Number(enrollment.amount || 0),
      currency: "INR",
      paymentStatus: "paid",
      paymentId,
      orderId,
      billingName: learner?.name || "Learner",
      billingEmail: learner?.email || "",
      issuedAt: new Date(),
      paidAt: new Date(),
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

export const createPaymentOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: "Enrollment ID is required",
      });
    }

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      learner: userId,
    })
      .populate("course", "title")
      .populate("batch");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This enrollment is already paid",
      });
    }

    if (enrollment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This enrollment has been cancelled",
      });
    }

    const amount = Number(enrollment.amount || 0);

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `enrollment_${enrollment._id}`,
      notes: {
        enrollmentId: String(enrollment._id),
        learnerId: String(userId),
      },
    });

    enrollment.paymentId = order.id;
    await enrollment.save();

    await PaymentTransaction.findOneAndUpdate(
      { orderId: order.id },
      {
        learner: userId,
        enrollment: enrollment._id,
        course:
          (enrollment.course as any)?._id ||
          enrollment.course,
        courseTitle:
          (enrollment.course as any)?.title ||
          "IMMIQ Course",
        orderId: order.id,
        amount,
        currency: "INR",
        status: "created",
        receipt: `enrollment_${enrollment._id}`,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      enrollment: {
        id: enrollment._id,
        amount: enrollment.amount,
        paymentStatus: enrollment.paymentStatus,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        "Failed to create payment order",
    });
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      enrollmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !enrollmentId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    const enrollment =
      await Enrollment.findOne({
        _id: enrollmentId,
        learner: userId,
      })
        .populate("course", "title")
        .populate("batch");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const transaction =
      await PaymentTransaction.findOne({
        orderId: razorpay_order_id,
        learner: userId,
        enrollment: enrollment._id,
      });

    if (
      enrollment.paymentStatus === "paid" &&
      transaction?.status === "paid"
    ) {
      const invoice = await createOrGetInvoice(
        enrollment,
        userId,
        razorpay_payment_id,
        razorpay_order_id
      );

      return res.status(200).json({
        success: true,
        message: "Payment is already verified",
        enrollment,
        invoice,
      });
    }

    if (
      enrollment.paymentId !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match this enrollment",
      });
    }

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key is not configured",
      });
    }

    const generatedSignature =
      crypto
        .createHmac("sha256", secret)
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      await PaymentTransaction.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "failed",
          failedAt: new Date(),
        }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    enrollment.paymentId =
      razorpay_payment_id;
    enrollment.paymentStatus = "paid";
    enrollment.status = "active";

    await enrollment.save();

    const invoice = await createOrGetInvoice(
      enrollment,
      userId,
      razorpay_payment_id,
      razorpay_order_id
    );

    await PaymentTransaction.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        invoiceNumber: invoice.invoiceNumber,
        status: "paid",
        paidAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      enrollment,
      invoice,
    });
  } catch (error) {
    console.error(
      "Verify Razorpay payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};
