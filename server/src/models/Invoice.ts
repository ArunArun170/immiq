import { Schema, model } from "mongoose";

const InvoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
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
      unique: true,
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
    paymentStatus: {
      type: String,
      enum: ["paid", "refunded", "cancelled"],
      default: "paid",
      index: true,
    },
    paymentId: {
      type: String,
      default: "",
      trim: true,
    },
    orderId: {
      type: String,
      default: "",
      trim: true,
    },
    billingName: {
      type: String,
      default: "",
      trim: true,
    },
    billingEmail: {
      type: String,
      default: "",
      trim: true,
    },
    billingPhone: {
      type: String,
      default: "",
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

InvoiceSchema.index({
  learner: 1,
  issuedAt: -1,
});

export default model("Invoice", InvoiceSchema);
