import { Schema, model } from "mongoose";

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  contactName: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default model("CorporateClient", schema);
