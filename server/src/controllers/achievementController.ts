import { Response } from "express";
import Achievement from "../models/Achievement";
import { AuthRequest } from "../middleware/auth";

export const getAchievements = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const achievements = await Achievement.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error("Get achievements error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
};

export const createAchievement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      date,
      category,
      image,
      featured,
    } = req.body;

    if (!title || !description || !date || !category) {
      res.status(400).json({
        success: false,
        message:
          "Title, description, date and category are required",
      });
      return;
    }

    const achievement = await Achievement.create({
      title,
      description,
      date,
      category,
      image: image || "",
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      achievement,
    });
  } catch (error) {
    console.error("Create achievement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create achievement",
    });
  }
};

export const updateAchievement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const achievement =
      await Achievement.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!achievement) {
      res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Achievement updated successfully",
      achievement,
    });
  } catch (error) {
    console.error("Update achievement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update achievement",
    });
  }
};

export const deleteAchievement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const achievement =
      await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Delete achievement error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete achievement",
    });
  }
};