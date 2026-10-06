import mongoose, { Document, Schema } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Milestone",
        "Award",
        "Media",
        "Partnership",
        "Certification",
      ],
    },
    image: {
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

export default mongoose.model<IAchievement>(
  "Achievement",
  achievementSchema
);