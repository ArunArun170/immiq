import { Schema, model } from "mongoose";

const schema = new Schema({
  learner: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  email: { type: String, default: "", lowercase: true, trim: true },
  answers: { type: Schema.Types.Mixed, default: {} },
  interests: { type: [String], default: [] },
  recommendations: [{ type: Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

export default model("InterestResult", schema);
