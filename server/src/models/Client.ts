import mongoose, { Document, Schema } from "mongoose";

export interface IClient extends Document {
  name: string;
  industry: string;
  description: string;
  projectType: string;
  location: string;
  website?: string;
  logo?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Coimbatore, Tamil Nadu",
    },
    website: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClient>("Client", clientSchema);