import { Request, Response } from "express";
import Testimonial from "../models/Testimonial";

/* =========================
   GET ALL TESTIMONIALS
========================= */

export const getTestimonials = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const testimonials =
      await Testimonial.find()
        .sort({
          order: 1,
          createdAt: -1,
        })
        .lean();

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error(
      "Get testimonials error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
    });
  }
};

/* =========================
   GET SINGLE TESTIMONIAL
========================= */

export const getTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const testimonial =
      await Testimonial.findById(
        req.params.id
      );

    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      testimonial,
    });
  } catch (error) {
    console.error(
      "Get testimonial error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial",
    });
  }
};

/* =========================
   CREATE TESTIMONIAL
========================= */

export const createTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      role,
      company,
      content,
      photo,
      rating,
      featured,
      active,
      order,
    } = req.body;

    if (
      !name ||
      !role ||
      !company ||
      !content
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, role, company and content are required",
      });

      return;
    }

    const testimonial =
      await Testimonial.create({
        name,
        role,
        company,
        content,
        photo: photo || "",
        rating: Number(rating) || 5,
        featured: Boolean(featured),
        active: active !== false,
        order: Number(order) || 0,
      });

    res.status(201).json({
      success: true,
      message:
        "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error(
      "Create testimonial error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create testimonial",
    });
  }
};

/* =========================
   UPDATE TESTIMONIAL
========================= */

export const updateTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      role,
      company,
      content,
      photo,
      rating,
      featured,
      active,
      order,
    } = req.body;

    const testimonial =
      await Testimonial.findByIdAndUpdate(
        req.params.id,
        {
          name,
          role,
          company,
          content,
          photo,
          rating: Number(rating) || 5,
          featured,
          active,
          order: Number(order) || 0,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error(
      "Update testimonial error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update testimonial",
    });
  }
};

/* =========================
   DELETE TESTIMONIAL
========================= */

export const deleteTestimonial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const testimonial =
      await Testimonial.findByIdAndDelete(
        req.params.id
      );

    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete testimonial error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete testimonial",
    });
  }
};