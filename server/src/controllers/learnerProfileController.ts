import { Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

const learnerOnly = (req: AuthRequest, res: Response): string | null => {
  if (!req.user?.userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return null;
  }

  if (req.user.role !== "learner") {
    res.status(403).json({ success: false, message: "Learner access required" });
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
    res.status(401).json({ success: false, message: "Invalid learner account" });
    return null;
  }

  return req.user.userId;
};

const publicProfile = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  avatarUrl: user.avatarUrl || "",
  bio: user.bio || "",
  city: user.city || "",
  state: user.state || "",
  country: user.country || "India",
  linkedinUrl: user.linkedinUrl || "",
  websiteUrl: user.websiteUrl || "",
  learningGoal: user.learningGoal || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getLearnerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = learnerOnly(req, res);
    if (!userId) return;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "Learner account not found" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: "This account is inactive" });
      return;
    }

    res.json({ success: true, profile: publicProfile(user) });
  } catch (error) {
    console.error("Get learner profile error:", error);
    res.status(500).json({ success: false, message: "Failed to load learner profile" });
  }
};

export const updateLearnerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = learnerOnly(req, res);
    if (!userId) return;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Learner account not found" });
      return;
    }

    const {
      name, phone, avatarUrl, bio, city, state, country,
      linkedinUrl, websiteUrl, learningGoal,
    } = req.body || {};

    if (name !== undefined) {
      const cleanName = String(name).trim();
      if (cleanName.length < 2 || cleanName.length > 100) {
        res.status(400).json({ success: false, message: "Name must be between 2 and 100 characters" });
        return;
      }
      user.name = cleanName;
    }

    const textFields: Array<[keyof typeof user, unknown, number]> = [
      ["phone", phone, 30],
      ["avatarUrl", avatarUrl, 500],
      ["bio", bio, 500],
      ["city", city, 100],
      ["state", state, 100],
      ["country", country, 100],
      ["linkedinUrl", linkedinUrl, 500],
      ["websiteUrl", websiteUrl, 500],
      ["learningGoal", learningGoal, 300],
    ];

    for (const [field, value, max] of textFields) {
      if (value === undefined) continue;
      const clean = String(value).trim();
      if (clean.length > max) {
        res.status(400).json({ success: false, message: `${String(field)} is too long` });
        return;
      }
      (user as any)[field] = clean;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: publicProfile(user),
    });
  } catch (error) {
    console.error("Update learner profile error:", error);
    res.status(500).json({ success: false, message: "Failed to update learner profile" });
  }
};

export const changeLearnerPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = learnerOnly(req, res);
    if (!userId) return;

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Current password and new password are required" });
      return;
    }

    if (String(newPassword).length < 6) {
      res.status(400).json({ success: false, message: "New password must contain at least 6 characters" });
      return;
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      res.status(404).json({ success: false, message: "Learner account not found" });
      return;
    }

    const matches = await bcrypt.compare(String(currentPassword), user.password);
    if (!matches) {
      res.status(400).json({ success: false, message: "Current password is incorrect" });
      return;
    }

    const samePassword = await bcrypt.compare(String(newPassword), user.password);
    if (samePassword) {
      res.status(400).json({ success: false, message: "New password must be different from the current password" });
      return;
    }

    user.password = await bcrypt.hash(String(newPassword), 12);
    await user.save();

    res.json({ success: true, message: "Password changed successfully. Please sign in again." });
  } catch (error) {
    console.error("Change learner password error:", error);
    res.status(500).json({ success: false, message: "Failed to change password" });
  }
};
