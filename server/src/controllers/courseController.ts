import { Response } from "express";

import Course from "../models/Course";
import { AuthRequest } from "../middleware/auth";

/* =========================
   PUBLIC COURSES
========================= */

export const getPublicCourses = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find({
      active: true,
    })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(
      "Get public courses error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/* =========================
   ADMIN - GET COURSES
========================= */

export const getCourses = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find()
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error(
      "Get admin courses error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

/* =========================
   GET SINGLE COURSE
========================= */

export const getCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course =
      await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error(
      "Get course error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

/* =========================
   CREATE COURSE
========================= */

export const createCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      technology,
      audience,
      level,
      mode,
      duration,
      fee,
      thumbnail,
      featured,
      active,
      order,
    } = req.body;

    if (
      !title ||
      !slug ||
      !description ||
      !technology
    ) {
      res.status(400).json({
        success: false,
        message:
          "Title, slug, description and technology are required",
      });
      return;
    }

    const cleanSlug = String(slug)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existingCourse =
      await Course.findOne({
        slug: cleanSlug,
      });

    if (existingCourse) {
      res.status(409).json({
        success: false,
        message:
          "A course with this slug already exists",
      });
      return;
    }

    const course = await Course.create({
      title: String(title).trim(),
      slug: cleanSlug,
      tagline: tagline || "",
      description: String(description).trim(),
      technology: String(technology).trim(),
      audience: audience || "",
      level: level || "Beginner",
      mode: mode || "Online",
      duration: duration || "",
      fee: Number(fee) || 0,
      thumbnail: thumbnail || "",
      featured: Boolean(featured),
      active:
        active === undefined
          ? true
          : Boolean(active),
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Create course error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

/* =========================
   UPDATE COURSE
========================= */

export const updateCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      slug,
      tagline,
      description,
      technology,
      audience,
      level,
      mode,
      duration,
      fee,
      thumbnail,
      featured,
      active,
      order,
    } = req.body;

    const course =
      await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    const cleanSlug = String(
      slug || course.slug
    )
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const duplicate =
      await Course.findOne({
        slug: cleanSlug,
        _id: {
          $ne: course._id,
        },
      });

    if (duplicate) {
      res.status(409).json({
        success: false,
        message:
          "Another course already uses this slug",
      });
      return;
    }

    course.title =
      title !== undefined
        ? String(title).trim()
        : course.title;

    course.slug = cleanSlug;

    course.tagline =
      tagline !== undefined
        ? tagline
        : course.tagline;

    course.description =
      description !== undefined
        ? String(description).trim()
        : course.description;

    course.technology =
      technology !== undefined
        ? String(technology).trim()
        : course.technology;

    course.audience =
      audience !== undefined
        ? audience
        : course.audience;

    course.level =
      level || course.level;

    course.mode =
      mode || course.mode;

    course.duration =
      duration !== undefined
        ? duration
        : course.duration;

    course.fee =
      fee !== undefined
        ? Number(fee) || 0
        : course.fee;

    course.thumbnail =
      thumbnail !== undefined
        ? thumbnail
        : course.thumbnail;

    course.featured =
      featured !== undefined
        ? Boolean(featured)
        : course.featured;

    course.active =
      active !== undefined
        ? Boolean(active)
        : course.active;

    course.order =
      order !== undefined
        ? Number(order) || 0
        : course.order;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error(
      "Update course error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

/* =========================
   DELETE COURSE
========================= */

export const deleteCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const course =
      await Course.findByIdAndDelete(
        req.params.id
      );

    if (!course) {
      res.status(404).json({
        success: false,
        message: "Course not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete course error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};