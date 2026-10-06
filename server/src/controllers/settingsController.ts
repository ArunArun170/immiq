import { Request, Response } from "express";

import Settings from "../models/Settings";
import { AuthRequest } from "../middleware/auth";

/* =========================
   PUBLIC SETTINGS
========================= */

export const getPublicSettings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    /*
     * Only expose public information.
     *
     * Never expose:
     * - Google Analytics ID
     * - Google Search Console verification
     * - Maintenance mode
     */

    const publicSettings = {
      siteName: settings.siteName,
      tagline: settings.tagline,

      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      whatsapp: settings.whatsapp,

      linkedin: settings.linkedin,
      instagram: settings.instagram,
      facebook: settings.facebook,
      youtube: settings.youtube,
      twitter: settings.twitter,

      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      seoKeywords: settings.seoKeywords,
      ogImage: settings.ogImage,
    };

    res.status(200).json({
      success: true,
      data: publicSettings,
    });
  } catch (error) {
    console.error(
      "Get public settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch public settings",
    });
  }
};

/* =========================
   ADMIN - GET SETTINGS
========================= */

export const getSettings = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "Get settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch settings",
    });
  }
};

/* =========================
   ADMIN - UPDATE SETTINGS
========================= */

export const updateSettings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    const fields = [
      "siteName",
      "tagline",
      "email",
      "phone",
      "address",
      "whatsapp",

      "linkedin",
      "instagram",
      "facebook",
      "youtube",
      "twitter",

      "seoTitle",
      "seoDescription",
      "seoKeywords",
      "ogImage",

      "googleAnalyticsId",
      "googleSearchConsoleCode",

      "maintenanceMode",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        (
          settings as unknown as Record<
            string,
            unknown
          >
        )[field] = req.body[field];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      message:
        "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error(
      "Update settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update settings",
    });
  }
};