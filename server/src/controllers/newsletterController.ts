import { Response } from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber";
import { AuthRequest } from "../middleware/auth";

export const subscribe = async (req:AuthRequest,res:Response)=>{try{const email=String(req.body.email||"").trim().toLowerCase();const name=String(req.body.name||"").trim();if(!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({success:false,message:"Valid email is required"});const subscriber=await NewsletterSubscriber.findOneAndUpdate({email},{email,name,active:true},{upsert:true,new:true,setDefaultsOnInsert:true});return res.status(201).json({success:true,message:"Subscribed successfully",subscriber:{email:subscriber?.email}});}catch(error){console.error(error);return res.status(500).json({success:false,message:"Subscription failed"});}};
