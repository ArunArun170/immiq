import { Schema, model } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    learner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    batch: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      index: true,
    },

    paymentId: {
      type: String,
      trim: true,
      default: "",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent the same learner from enrolling
 * into the same batch more than once.
 */
EnrollmentSchema.index(
  {
    learner: 1,
    batch: 1,
  },
  {
    unique: true,
  }
);

export default model("Enrollment", EnrollmentSchema);