import bcrypt from "bcryptjs";
import User from "../models/User";
import CorporateClient from "../models/CorporateClient";
import CorporateLearner from "../models/CorporateLearner";
import Enrollment from "../models/Enrollment";

export const seedCorporate = async (): Promise<void> => {
  const email = "corporate@demo.immiq.in";
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "Demo Corporate Admin",
      email,
      password: await bcrypt.hash("Corporate@12345", 12),
      role: "client",
      permissions: [],
      isActive: true,
    });
  }

  let client = await CorporateClient.findOne({ user: user._id });
  if (!client) {
    client = await CorporateClient.create({
      user: user._id,
      companyName: "IMMIQ Demo Technologies",
      contactName: "Demo Corporate Admin",
      contactEmail: email,
      active: true,
    });
  }

  const enrollment: any = await Enrollment.findOne({ status: { $in: ["paid", "active", "completed"] } }).sort({ createdAt: 1 });
  if (enrollment) {
    await CorporateLearner.updateOne(
      { corporateClient: client._id, enrollment: enrollment._id },
      { $setOnInsert: { corporateClient: client._id, learner: enrollment.learner, enrollment: enrollment._id, active: true } },
      { upsert: true },
    );
  }

  console.log("✅ Corporate learning seed checked");
};
