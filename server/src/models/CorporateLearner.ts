import { Schema, model } from "mongoose";

const schema = new Schema({
  corporateClient: { type: Schema.Types.ObjectId, ref: "CorporateClient", required: true, index: true },
  learner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

schema.index({ corporateClient: 1, learner: 1, enrollment: 1 }, { unique: true });
export default model("CorporateLearner", schema);
