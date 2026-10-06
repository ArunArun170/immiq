import { Schema, model, Types } from "mongoose";

const BatchSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    schedule: {
      type: String,
      trim: true,
      default: "",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },

    venue: {
      type: String,
      trim: true,
      default: "",
    },

    link: {
      type: String,
      trim: true,
      default: "",
    },

    seatsTotal: {
      type: Number,
      required: true,
      min: 1,
      default: 20,
    },

    seatsFilled: {
      type: Number,
      min: 0,
      default: 0,
    },

    priceOverride: {
      type: Number,
      min: 0,
      default: 0,
    },

    earlyBirdTill: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "running",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
      index: true,
    },

    mentors: [
      {
        type: Schema.Types.ObjectId,
        ref: "TeamMember",
      },
    ],
  },
  {
    timestamps: true,
  }
);

BatchSchema.index({
  course: 1,
  startDate: 1,
});

export default model("Batch", BatchSchema);