import mongoose, { Document, Schema } from "mongoose";

export interface ILessonProgress extends Document {
  learner: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ILessonProgress>({
  learner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true, index: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  module: { type: Schema.Types.ObjectId, ref: "CourseModule", required: true, index: true },
  lesson: { type: Schema.Types.ObjectId, required: true, index: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

schema.index({ learner: 1, enrollment: 1, lesson: 1 }, { unique: true });

export default mongoose.model<ILessonProgress>("LessonProgress", schema);
