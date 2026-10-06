import { Response } from "express";
import bcrypt from "bcryptjs";

import User, {
  UserRole,
} from "../models/User";

import { AuthRequest } from "../middleware/auth";

/* =========================
   SAFE USER RESPONSE
========================= */

const safeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: user.permissions || [],
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/* =========================
   GET USERS
========================= */

export const getUsers = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find()
      .select(
        "name email role permissions isActive createdAt updatedAt"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      data: users.map(safeUser),
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

/* =========================
   GET SINGLE USER
========================= */

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(
      req.params.id
    )
      .select(
        "name email role permissions isActive createdAt updatedAt"
      )
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: safeUser(user),
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

/* =========================
   CREATE USER
========================= */

export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      permissions,
      isActive,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });

      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });

      return;
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          "A user with this email already exists",
      });

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role:
        (role as UserRole) ||
        "learner",
      permissions:
        Array.isArray(permissions)
          ? permissions
          : [],
      isActive:
        isActive !== false &&
        isActive !== "false",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser(user),
    });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

/* =========================
   UPDATE USER
========================= */

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    const {
      name,
      email,
      password,
      role,
      permissions,
      isActive,
    } = req.body;

    if (email !== undefined) {
      const normalizedEmail =
        email.toLowerCase().trim();

      const duplicate =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (duplicate) {
        res.status(409).json({
          success: false,
          message:
            "Another user already uses this email",
        });

        return;
      }

      user.email =
        normalizedEmail;
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (role !== undefined) {
      user.role =
        role as UserRole;
    }

    if (
      permissions !== undefined &&
      Array.isArray(permissions)
    ) {
      user.permissions =
        permissions;
    }

    if (isActive !== undefined) {
      user.isActive =
        isActive === true ||
        isActive === "true";
    }

    if (
      password !== undefined &&
      password !== ""
    ) {
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message:
            "Password must contain at least 6 characters",
        });

        return;
      }

      user.password =
        await bcrypt.hash(
          password,
          12
        );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: safeUser(user),
    });
  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

/* =========================
   DELETE USER
========================= */

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (
      req.user?.userId ===
      req.params.id
    ) {
      res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });

      return;
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};