import mongoose, { Document, Schema } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  department: string;
  bio: string;
  photo: string;
  skills: string[];
  linkedin: string;
  email: string;
  featured: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
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

    department: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      default: "",
    },

    email: {
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

export default mongoose.model<ITeamMember>(
  "TeamMember",
  teamMemberSchema
);