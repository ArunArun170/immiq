import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
  endDate: { type: Date },
  mode: { type: String, enum: ["Online", "Offline", "Hybrid"], default: "Online" },
  venue: { type: String, default: "" },
  link: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

schema.index({ date: 1, active: 1 });
export default model("Event", schema);
