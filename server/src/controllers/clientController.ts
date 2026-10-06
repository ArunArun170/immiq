import { Response } from "express";
import Client from "../models/Client";
import { AuthRequest } from "../middleware/auth";

export const getClients = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const clients = await Client.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};

export const createClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      industry,
      description,
      projectType,
      location,
      website,
      logo,
      featured,
    } = req.body;

    if (
      !name ||
      !industry ||
      !description ||
      !projectType
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, industry, description and project type are required",
      });
      return;
    }

    const client = await Client.create({
      name,
      industry,
      description,
      projectType,
      location: location || "Coimbatore, Tamil Nadu",
      website: website || "",
      logo: logo || "",
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Create client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const updateClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
  }
};

export const deleteClient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      res.status(404).json({
        success: false,
        message: "Client not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
  }
};