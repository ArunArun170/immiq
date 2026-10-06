import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  technology: string;
  audience: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mode: "Online" | "Offline" | "Hybrid";
  duration: string;
  fee: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    technology: {
      type: String,
      required: true,
      trim: true,
    },

    audience: {
      type: String,
      default: "",
      trim: true,
    },

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },

    mode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Hybrid",
      ],
      default: "Online",
    },

    duration: {
      type: String,
      default: "",
      trim: true,
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({
  technology: 1,
  level: 1,
  mode: 1,
});

courseSchema.index({
  active: 1,
  order: 1,
});

export default mongoose.model<ICourse>(
  "Course",
  courseSchema
);