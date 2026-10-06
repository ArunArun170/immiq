import mongoose, { Document, Schema } from "mongoose";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";

export type LeadType =
  | "training"
  | "saas"
  | "services"
  | "consultation"
  | "general";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  type: LeadType;
  status: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "training",
        "saas",
        "services",
        "consultation",
        "general",
      ],
      default: "general",
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "closed",
      ],
      default: "new",
      index: true,
    },

    notes: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILead>("Lead", leadSchema);