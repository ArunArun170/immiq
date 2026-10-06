import { Response } from "express";

import Service from "../models/Service";
import { AuthRequest } from "../middleware/auth";

/* =========================
   GET SERVICES
========================= */

export const getServices = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

/* =========================
   GET SINGLE SERVICE
========================= */

export const getService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

/* =========================
   CREATE SERVICE
========================= */

export const createService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      slug,
      description,
      category,
      icon,
      features,
      featured,
      active,
    } = req.body;

    if (
      !title ||
      !slug ||
      !description ||
      !category
    ) {
      res.status(400).json({
        success: false,
        message:
          "Title, slug, description and category are required",
      });
      return;
    }

    const existingService = await Service.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existingService) {
      res.status(409).json({
        success: false,
        message: "A service with this slug already exists",
      });
      return;
    }

    const service = await Service.create({
      title,
      slug: slug.toLowerCase().trim(),
      description,
      category,
      icon: icon || "Code2",
      features: Array.isArray(features)
        ? features
        : [],
      featured: Boolean(featured),
      active:
        active === undefined
          ? true
          : Boolean(active),
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

/* =========================
   UPDATE SERVICE
========================= */

export const updateService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    if (updateData.slug) {
      updateData.slug = updateData.slug
        .toLowerCase()
        .trim();
    }

    if (updateData.features !== undefined) {
      updateData.features = Array.isArray(
        updateData.features
      )
        ? updateData.features
        : [];
    }

    const service =
      await Service.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

/* =========================
   DELETE SERVICE
========================= */

export const deleteService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const service =
      await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};