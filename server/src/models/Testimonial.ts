import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  content: string;
  photo: string;
  rating: number;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
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

export default mongoose.model<ITestimonial>(
  "Testimonial",
  testimonialSchema
);