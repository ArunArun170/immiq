import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  type: { type: String, enum: ["PDF", "Video", "Link", "Notes", "Assignment", "Other"], default: "Other" },
  url: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

schema.index({ active: 1, order: 1 });
export default model("Resource", schema);
