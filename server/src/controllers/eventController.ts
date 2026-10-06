import { Response } from "express";
import mongoose from "mongoose";
import Event from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import { AuthRequest } from "../middleware/auth";

const getParam = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
};

export const getPublicEvents = async (_req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({
      active: true,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .lean();

    return res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") {
      return res.status(403).json({ success: false, message: "Learner access required" });
    }

    const eventId = getParam(req.params.eventId);
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event id" });
    }

    const event = await Event.findOne({
      _id: eventId,
      active: true,
      date: { $gte: new Date() },
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or registration is closed" });
    }

    const registration = await EventRegistration.findOneAndUpdate(
      { event: event._id, learner: req.user.userId },
      { event: event._id, learner: req.user.userId, status: "registered" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate("event");

    return res.json({ success: true, message: "Registered for event", registration });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to register for event" });
  }
};

export const cancelEventRegistration = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") {
      return res.status(403).json({ success: false, message: "Learner access required" });
    }

    const eventId = getParam(req.params.eventId);
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event id" });
    }

    const registration = await EventRegistration.findOneAndUpdate(
      { event: eventId, learner: req.user.userId },
      { status: "cancelled" },
      { new: true }
    ).populate("event");

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    return res.json({ success: true, message: "Event registration cancelled", registration });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to cancel registration" });
  }
};

export const getMyEventRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const registrations = await EventRegistration.find({ learner: req.user.userId })
      .populate("event")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, registrations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
};
