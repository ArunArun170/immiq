import mongoose from "mongoose";
import { Response } from "express";
import CourseModule from "../models/CourseModule";
import LessonProgress from "../models/LessonProgress";
import Enrollment from "../models/Enrollment";
import { AuthRequest } from "../middleware/auth";

const param = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
};

export const getLearnerCourseContent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") return res.status(403).json({ success:false, message:"Learner access required" });
    const enrollmentId = param(req.params.enrollmentId);
    if (!enrollmentId || !mongoose.Types.ObjectId.isValid(enrollmentId)) return res.status(400).json({ success:false, message:"Invalid enrollment ID" });
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, learner: req.user.userId }).lean();
    if (!enrollment) return res.status(404).json({ success:false, message:"Enrollment not found" });
    const modules = await CourseModule.find({ course: enrollment.course, active:true }).sort({order:1}).lean();
    const progress = await LessonProgress.find({ learner:req.user.userId, enrollment:enrollment._id, completed:true }).lean();
    const completed = new Set(progress.map((item)=>item.lesson.toString()));
    let totalLessons = 0;
    const mapped = modules.map((module)=>({ ...module, lessons: module.lessons.filter((l)=>l.active).sort((a,b)=>a.order-b.order).map((lesson)=>{ totalLessons += 1; return { ...lesson, completed: completed.has(lesson._id.toString()) }; }) }));
    const completedLessons = progress.length;
    return res.json({ success:true, courseId:enrollment.course, enrollmentId:enrollment._id, modules:mapped, progress:{ totalLessons, completedLessons, percentage:totalLessons ? Math.round((completedLessons/totalLessons)*100) : 0 } });
  } catch (error) { console.error("Learning content error", error); return res.status(500).json({success:false,message:"Failed to load course content"}); }
};

export const completeLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId || req.user.role !== "learner") return res.status(403).json({success:false,message:"Learner access required"});
    const enrollmentId = param(req.params.enrollmentId); const lessonId = param(req.params.lessonId);
    if (!enrollmentId || !lessonId || !mongoose.Types.ObjectId.isValid(enrollmentId)) return res.status(400).json({success:false,message:"Invalid lesson or enrollment ID"});
    const enrollment = await Enrollment.findOne({_id:enrollmentId, learner:req.user.userId});
    if (!enrollment) return res.status(404).json({success:false,message:"Enrollment not found"});
    const module = await CourseModule.findOne({course:enrollment.course, "lessons._id":lessonId, active:true});
    if (!module) return res.status(404).json({success:false,message:"Lesson not found"});
    await LessonProgress.findOneAndUpdate({learner:req.user.userId,enrollment:enrollment._id,lesson:lessonId},{learner:req.user.userId,enrollment:enrollment._id,course:enrollment.course,module:module._id,lesson:lessonId,completed:true,completedAt:new Date()},{upsert:true,new:true,setDefaultsOnInsert:true});
    const total = await CourseModule.aggregate([{ $match:{course:enrollment.course,active:true} },{$unwind:"$lessons"},{$match:{"lessons.active":true}},{$count:"count"}]);
    const done = await LessonProgress.countDocuments({learner:req.user.userId,enrollment:enrollment._id,completed:true});
    const totalLessons = total[0]?.count || 0; const percentage = totalLessons ? Math.round((done/totalLessons)*100) : 0;
    if (percentage === 100 && enrollment.status === "active") { enrollment.status = "completed"; await enrollment.save(); }
    return res.json({success:true,message:"Lesson completed",progress:{totalLessons,completedLessons:done,percentage}});
  } catch (error) { console.error("Complete lesson error", error); return res.status(500).json({success:false,message:"Failed to complete lesson"}); }
};
