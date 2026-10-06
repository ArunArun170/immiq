import { Request, Response } from "express";
import TeamMember from "../models/TeamMember";

export const getTeamMembers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const members = await TeamMember.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("Get team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
    });
  }
};

export const getTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const member = await TeamMember.findById(
      req.params.id
    );

    if (!member) {
      res.status(404).json({
        success: false,
        message: "Team member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Get team member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team member",
    });
  }
};

export const createTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      role,
      department,
      bio,
      photo,
      skills,
      linkedin,
      email,
      featured,
      active,
      order,
    } = req.body;

    if (!name || !role || !department || !bio) {
      res.status(400).json({
        success: false,
        message:
          "Name, role, department and bio are required",
      });
      return;
    }

    const member = await TeamMember.create({
      name,
      role,
      department,
      bio,
      photo: photo || "",
      skills: Array.isArray(skills) ? skills : [],
      linkedin: linkedin || "",
      email: email || "",
      featured: Boolean(featured),
      active: active !== false,
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      member,
    });
  } catch (error) {
    console.error("Create team member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create team member",
    });
  }
};

export const updateTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      role,
      department,
      bio,
      photo,
      skills,
      linkedin,
      email,
      featured,
      active,
      order,
    } = req.body;

    const member =
      await TeamMember.findByIdAndUpdate(
        req.params.id,
        {
          name,
          role,
          department,
          bio,
          photo,
          skills: Array.isArray(skills)
            ? skills
            : [],
          linkedin,
          email,
          featured,
          active,
          order: Number(order) || 0,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!member) {
      res.status(404).json({
        success: false,
        message: "Team member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      member,
    });
  } catch (error) {
    console.error("Update team member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update team member",
    });
  }
};

export const deleteTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const member =
      await TeamMember.findByIdAndDelete(
        req.params.id
      );

    if (!member) {
      res.status(404).json({
        success: false,
        message: "Team member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Delete team member error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team member",
    });
  }
};