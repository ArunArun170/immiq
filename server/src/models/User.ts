import mongoose, { Document, Schema } from "mongoose";

export type UserRole =
  | "learner"
  | "client"
  | "editor"
  | "manager"
  | "admin"
  | "super_admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  learningGoal?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "learner",
        "client",
        "editor",
        "manager",
        "admin",
        "super_admin",
      ],
      default: "learner",
      index: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    phone: { type: String, default: "", trim: true },
    avatarUrl: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true, maxlength: 500 },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    linkedinUrl: { type: String, default: "", trim: true },
    websiteUrl: { type: String, default: "", trim: true },
    learningGoal: { type: String, default: "", trim: true, maxlength: 300 },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);