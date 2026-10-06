import mongoose, { Document, Schema } from "mongoose";

export type CertificateStatus = "issued" | "revoked";

export interface ICertificate extends Document {
  certificateNumber: string;
  learner: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  courseTitle: string;
  learnerName: string;
  issuedAt: Date;
  status: CertificateStatus;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    learner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      unique: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    learnerName: {
      type: String,
      required: true,
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["issued", "revoked"],
      default: "issued",
      index: true,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ learner: 1, issuedAt: -1 });

export default mongoose.model<ICertificate>("Certificate", certificateSchema);
