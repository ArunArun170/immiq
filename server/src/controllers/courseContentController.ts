import mongoose from "mongoose";
import { Response } from "express";
import Course from "../models/Course";
import CourseModule from "../models/CourseModule";
import { AuthRequest } from "../middleware/auth";

const param = (value: unknown): string | null => typeof value === "string" ? value : Array.isArray(value) && typeof value[0] === "string" ? value[0] : null;
const valid = (value: string | null) => !!value && mongoose.Types.ObjectId.isValid(value);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const getCourseContent = async (req: AuthRequest,res: Response) => {
 try { const courseId=param(req.params.courseId); if(!valid(courseId)) return res.status(400).json({success:false,message:"Invalid course ID"}); const course=await Course.findById(courseId).lean(); if(!course)return res.status(404).json({success:false,message:"Course not found"}); const modules=await CourseModule.find({course:courseId}).sort({order:1}).lean(); return res.json({success:true,course,modules}); } catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to load course content"});}
};

export const createCourseModule = async (req: AuthRequest,res: Response) => {
 try { const courseId=param(req.params.courseId); if(!valid(courseId))return res.status(400).json({success:false,message:"Invalid course ID"}); if(!(await Course.exists({_id:courseId})))return res.status(404).json({success:false,message:"Course not found"}); const {title,description,order,active}=req.body; if(!title)return res.status(400).json({success:false,message:"Module title is required"}); const module=await CourseModule.create({course:courseId,title:String(title).trim(),description:description||"",order:Number(order)||0,active:active===undefined?true:Boolean(active),lessons:[]}); return res.status(201).json({success:true,module}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to create module"});}
};

export const updateCourseModule = async (req: AuthRequest,res: Response) => {
 try { const moduleId=param(req.params.moduleId); if(!valid(moduleId))return res.status(400).json({success:false,message:"Invalid module ID"}); const module=await CourseModule.findById(moduleId); if(!module)return res.status(404).json({success:false,message:"Module not found"}); const {title,description,order,active}=req.body; if(title!==undefined)module.title=String(title).trim(); if(description!==undefined)module.description=String(description); if(order!==undefined)module.order=Number(order)||0; if(active!==undefined)module.active=Boolean(active); await module.save(); return res.json({success:true,module}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to update module"});}
};

export const deleteCourseModule = async (req: AuthRequest,res: Response) => { try { const moduleId=param(req.params.moduleId); if(!valid(moduleId))return res.status(400).json({success:false,message:"Invalid module ID"}); const deleted=await CourseModule.findByIdAndDelete(moduleId); if(!deleted)return res.status(404).json({success:false,message:"Module not found"}); return res.json({success:true,message:"Module deleted"}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to delete module"});} };

export const createLesson = async (req: AuthRequest,res: Response) => {
 try { const moduleId=param(req.params.moduleId); if(!valid(moduleId))return res.status(400).json({success:false,message:"Invalid module ID"}); const module=await CourseModule.findById(moduleId); if(!module)return res.status(404).json({success:false,message:"Module not found"}); const {title,description,content,videoUrl,duration,order,freePreview,active}=req.body; if(!title)return res.status(400).json({success:false,message:"Lesson title is required"}); module.lessons.push({title:String(title).trim(),slug:slugify(String(title)),description:description||"",content:content||"",videoUrl:videoUrl||"",duration:duration||"",order:Number(order)||0,freePreview:Boolean(freePreview),active:active===undefined?true:Boolean(active)} as any); await module.save(); return res.status(201).json({success:true,module}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to create lesson"});}
};

export const updateLesson = async (req: AuthRequest,res: Response) => {
 try { const moduleId=param(req.params.moduleId); const lessonId=param(req.params.lessonId); if(!valid(moduleId)||!lessonId||!mongoose.Types.ObjectId.isValid(lessonId))return res.status(400).json({success:false,message:"Invalid module or lesson ID"}); const module=await CourseModule.findById(moduleId); if(!module)return res.status(404).json({success:false,message:"Module not found"}); const lesson=module.lessons.id(lessonId); if(!lesson)return res.status(404).json({success:false,message:"Lesson not found"}); const {title,description,content,videoUrl,duration,order,freePreview,active}=req.body; if(title!==undefined){lesson.title=String(title).trim();lesson.slug=slugify(lesson.title);} if(description!==undefined)lesson.description=String(description); if(content!==undefined)lesson.content=String(content); if(videoUrl!==undefined)lesson.videoUrl=String(videoUrl); if(duration!==undefined)lesson.duration=String(duration); if(order!==undefined)lesson.order=Number(order)||0; if(freePreview!==undefined)lesson.freePreview=Boolean(freePreview); if(active!==undefined)lesson.active=Boolean(active); await module.save(); return res.json({success:true,module}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to update lesson"});}
};

export const deleteLesson = async (req: AuthRequest,res: Response) => { try { const moduleId=param(req.params.moduleId); const lessonId=param(req.params.lessonId); if(!valid(moduleId)||!lessonId||!mongoose.Types.ObjectId.isValid(lessonId))return res.status(400).json({success:false,message:"Invalid module or lesson ID"}); const module=await CourseModule.findById(moduleId); if(!module)return res.status(404).json({success:false,message:"Module not found"}); const lesson=module.lessons.id(lessonId); if(!lesson)return res.status(404).json({success:false,message:"Lesson not found"}); lesson.deleteOne(); await module.save(); return res.json({success:true,message:"Lesson deleted"}); }catch(error){console.error(error);return res.status(500).json({success:false,message:"Failed to delete lesson"});} };
