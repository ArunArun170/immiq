import { Schema, model } from "mongoose";

export type PaymentTransactionStatus =
  | "created"
  | "paid"
  | "failed"
  | "refunded";

const PaymentTransactionSchema = new Schema(
  {
    learner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },
    method: {
      type: String,
      default: "",
      trim: true,
    },
    receipt: {
      type: String,
      default: "",
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PaymentTransactionSchema.index({
  learner: 1,
  createdAt: -1,
});

PaymentTransactionSchema.index({
  learner: 1,
  enrollment: 1,
  createdAt: -1,
});

export default model("PaymentTransaction", PaymentTransactionSchema);
