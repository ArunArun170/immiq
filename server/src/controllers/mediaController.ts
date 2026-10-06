import { Response } from "express";

import Media from "../models/Media";
import { AuthRequest } from "../middleware/auth";

/* =========================
   GET ALL MEDIA
========================= */

export const getMedia = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const media = await Media.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error(
      "Get media error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
};

/* =========================
   GET SINGLE MEDIA
========================= */

export const getMediaById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const media = await Media.findById(
      req.params.id
    );

    if (!media) {
      res.status(404).json({
        success: false,
        message: "Media not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error(
      "Get media by id error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch media",
    });
  }
};

/* =========================
   CREATE MEDIA
========================= */

export const createMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      url,
      type,
      alt,
      description,
      featured,
      active,
    } = req.body;

    if (!title || !url) {
      res.status(400).json({
        success: false,
        message:
          "Title and URL are required",
      });

      return;
    }

    const media = await Media.create({
      title: title.trim(),
      url: url.trim(),
      type: type || "image",
      alt: alt || "",
      description: description || "",
      featured:
        featured === true ||
        featured === "true",
      active:
        active !== false &&
        active !== "false",
    });

    res.status(201).json({
      success: true,
      message: "Media created successfully",
      data: media,
    });
  } catch (error) {
    console.error(
      "Create media error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create media",
    });
  }
};

/* =========================
   UPDATE MEDIA
========================= */

export const updateMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const media =
      await Media.findById(
        req.params.id
      );

    if (!media) {
      res.status(404).json({
        success: false,
        message: "Media not found",
      });

      return;
    }

    const fields = [
      "title",
      "url",
      "type",
      "alt",
      "description",
      "featured",
      "active",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        (
          media as unknown as Record<
            string,
            unknown
          >
        )[field] =
          req.body[field];
      }
    });

    await media.save();

    res.status(200).json({
      success: true,
      message: "Media updated successfully",
      data: media,
    });
  } catch (error) {
    console.error(
      "Update media error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update media",
    });
  }
};

/* =========================
   DELETE MEDIA
========================= */

export const deleteMedia = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const media =
      await Media.findByIdAndDelete(
        req.params.id
      );

    if (!media) {
      res.status(404).json({
        success: false,
        message: "Media not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete media error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete media",
    });
  }
};