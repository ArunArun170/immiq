import mongoose, {
  Document,
  Schema,
} from "mongoose";

export type MediaType =
  | "image"
  | "video"
  | "document"
  | "other";

export interface IMedia extends Document {
  title: string;
  url: string;
  type: MediaType;
  alt: string;
  description: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "image",
        "video",
        "document",
        "other",
      ],
      default: "image",
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
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

export default mongoose.model<IMedia>(
  "Media",
  mediaSchema
);