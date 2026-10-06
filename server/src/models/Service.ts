import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
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

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "Code2",
    },

    features: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IService>(
  "Service",
  serviceSchema
);