import { Request, Response } from "express";
import Batch from "../models/Batch";

export const getPublicBatches = async (
  _req: Request,
  res: Response
) => {
  try {
    const batches = await Batch.find({
      status: {
        $in: ["upcoming", "running"],
      },
    })
      .populate(
        "course",
        "title slug tagline technology level mode duration fee"
      )
      .sort({
        startDate: 1,
      })
      .lean();

    res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error(
      "Get public batches error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};

export const getBatches = async (
  _req: Request,
  res: Response
) => {
  try {
    const batches = await Batch.find()
      .populate(
        "course",
        "title slug technology level"
      )
      .populate(
        "mentors",
        "name designation"
      )
      .sort({
        startDate: 1,
      })
      .lean();

    res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error(
      "Get batches error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};

export const getBatchById = async (
  req: Request,
  res: Response
) => {
  try {
    const batch = await Batch.findById(
      req.params.id
    )
      .populate(
        "course",
        "title slug tagline technology level mode duration fee"
      )
      .populate(
        "mentors",
        "name designation"
      )
      .lean();

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      batch,
    });
  } catch (error) {
    console.error(
      "Get batch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
    });
  }
};

export const createBatch = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      course,
      name,
      startDate,
      endDate,
      schedule,
      mode,
      venue,
      link,
      seatsTotal,
      seatsFilled,
      priceOverride,
      earlyBirdTill,
      status,
      mentors,
    } = req.body;

    if (!course || !name || !startDate) {
      return res.status(400).json({
        success: false,
        message:
          "Course, batch name and start date are required",
      });
    }

    const batch = await Batch.create({
      course,
      name,
      startDate,
      endDate,
      schedule,
      mode,
      venue,
      link,
      seatsTotal,
      seatsFilled,
      priceOverride,
      earlyBirdTill,
      status,
      mentors,
    });

    const populatedBatch =
      await Batch.findById(batch._id)
        .populate(
          "course",
          "title slug technology level"
        )
        .populate(
          "mentors",
          "name designation"
        );

    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      batch: populatedBatch,
    });
  } catch (error) {
    console.error(
      "Create batch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create batch",
    });
  }
};

export const updateBatch = async (
  req: Request,
  res: Response
) => {
  try {
    const batch =
      await Batch.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "course",
          "title slug technology level"
        )
        .populate(
          "mentors",
          "name designation"
        );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      batch,
    });
  } catch (error) {
    console.error(
      "Update batch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update batch",
    });
  }
};

export const deleteBatch = async (
  req: Request,
  res: Response
) => {
  try {
    const batch =
      await Batch.findByIdAndDelete(
        req.params.id
      );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete batch error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete batch",
    });
  }
};