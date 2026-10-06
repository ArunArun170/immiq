import mongoose, { Document, Schema } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  image?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    image: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlogPost>(
  "BlogPost",
  blogPostSchema
);