import mongoose, { Document, Schema } from "mongoose";

export interface ICourseLesson extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: string;
  order: number;
  freePreview: boolean;
  active: boolean;
}

export interface ICourseModule extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  active: boolean;
  lessons: ICourseLesson[];
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ICourseLesson>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, lowercase: true },
  description: { type: String, default: "", trim: true },
  content: { type: String, default: "" },
  videoUrl: { type: String, default: "", trim: true },
  duration: { type: String, default: "", trim: true },
  order: { type: Number, default: 0 },
  freePreview: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
});

const courseModuleSchema = new Schema<ICourseModule>({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  lessons: { type: [lessonSchema], default: [] },
}, { timestamps: true });

courseModuleSchema.index({ course: 1, order: 1 });

export default mongoose.model<ICourseModule>("CourseModule", courseModuleSchema);
