import { Request, Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/auth";

/* =========================
   PUBLIC CREATE LEAD
========================= */

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      type,
    } = req.body;

    if (!name || !email || !phone || !message) {
      res.status(400).json({
        success: false,
        message:
          "Name, email, phone and message are required",
      });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
      type: type || "general",
      status: "new",
      source: "website",
    });

    res.status(201).json({
      success: true,
      message:
        "Thank you. Your enquiry has been submitted successfully.",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};

/* =========================
   ADMIN GET LEADS
========================= */

export const getLeads = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

/* =========================
   ADMIN GET SINGLE LEAD
========================= */

export const getLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};

/* =========================
   ADMIN UPDATE LEAD
========================= */

export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      status,
      notes,
    } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead",
    });
  }
};