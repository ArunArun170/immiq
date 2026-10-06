import { Schema, model } from "mongoose";

const schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
  learner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: { type: String, enum: ["registered", "cancelled"], default: "registered" },
}, { timestamps: true });

schema.index({ event: 1, learner: 1 }, { unique: true });
export default model("EventRegistration", schema);
