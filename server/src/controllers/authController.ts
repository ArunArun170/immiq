import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import { generateAccessToken } from "../utils/token";
import { AuthRequest } from "../middleware/auth";

/**
 * Login
 * Used by both admin and learner accounts.
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "This account is inactive",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      permissions: user.permissions,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * Learner Registration
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).toLowerCase().trim();

    if (cleanName.length < 2) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "learner",
      permissions: [],
      isActive: true,
    });

    const token = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
      permissions: user.permissions,
    });

    res.status(201).json({
      success: true,
      message: "Learner account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.code === 11000) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

/**
 * Current authenticated user
 */
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "This account is inactive",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};