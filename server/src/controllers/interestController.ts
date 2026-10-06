import { Response } from "express";
import Course from "../models/Course";
import InterestResult from "../models/InterestResult";
import { AuthRequest } from "../middleware/auth";

export const submitInterest = async (req:AuthRequest,res:Response)=>{try{const answers=req.body.answers||{};const text=JSON.stringify(answers).toLowerCase();const courses=await Course.find({active:true}).sort({featured:-1,order:1}).limit(6).lean();const scored=courses.map(c=>{const hay=`${c.title} ${c.technology} ${c.audience}`.toLowerCase();const score=hay.split(/\s+/).filter((word)=>word.length>3&&text.includes(word)).length;return {course:c,score};}).sort((a,b)=>b.score-a.score);const recommendations=scored.slice(0,3).map(x=>x.course._id);const interests=scored.slice(0,3).map(x=>x.course.technology);const result=await InterestResult.create({learner:req.user?.userId||null,email:req.body.email||"",answers,interests,recommendations});return res.json({success:true,result:{id:result._id,interests,recommendations:scored.slice(0,3).map(x=>x.course)}});}catch(error){console.error(error);return res.status(500).json({success:false,message:"Interest finder failed"});}};
