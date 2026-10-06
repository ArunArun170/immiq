import Course from "../models/Course";
import CourseModule from "../models/CourseModule";
import Event from "../models/Event";
import Resource from "../models/Resource";

export const seedPhase2 = async (): Promise<void> => {
  const courses = await Course.find({active:true}).sort({order:1}).limit(8).lean();
  for (const course of courses) {
    const exists = await CourseModule.exists({course:course._id});
    if (exists) continue;
    await CourseModule.create([
      {course:course._id,title:"Getting Started",description:"Course orientation and foundations.",order:1,lessons:[{title:"Welcome to IMMIQ Learning",slug:"welcome-to-immiq-learning",description:"Understand the course journey and learning expectations.",content:"Welcome to your IMMIQ learning journey. Start with curiosity, build consistently and complete the practical work.",duration:"10 min",order:1,freePreview:true,active:true},{title:"How to Learn Effectively",slug:"how-to-learn-effectively",description:"A practical learning workflow.",content:"Study the lesson, practise the concept, build something small and review what you built.",duration:"15 min",order:2,active:true}]},
      {course:course._id,title:"Core Concepts",description:"Build the core skills for this program.",order:2,lessons:[{title:"Core Concepts",slug:"core-concepts",description:"The key concepts behind this technology.",content:"Use this lesson as the starting point for the core concepts of the selected program.",duration:"25 min",order:1,active:true},{title:"Practice Project",slug:"practice-project",description:"Apply what you have learned.",content:"Create a small practical project using the concepts covered in the previous lessons.",duration:"45 min",order:2,active:true}]}
    ]);
  }
  if(await Event.countDocuments()===0){await Event.insertMany([
    {title:"IMMIQ Emerging Tech Webinar",slug:"immiq-emerging-tech-webinar",description:"A practical session exploring what is changing in technology.",date:new Date(Date.now()+1000*60*60*24*14),mode:"Online",link:"https://example.com/immiq-webinar",active:true},
    {title:"Build With AI Workshop",slug:"build-with-ai-workshop",description:"A hands-on learner workshop focused on practical AI workflows and product thinking.",date:new Date(Date.now()+1000*60*60*24*28),mode:"Online",link:"https://example.com/immiq-ai-workshop",active:true},
    {title:"IMMIQ Learning Community Meetup",slug:"immiq-learning-community-meetup",description:"Connect with fellow learners, share projects and learn from each other's journeys.",date:new Date(Date.now()+1000*60*60*24*42),mode:"Hybrid",venue:"IMMIQ Learning Hub, Coimbatore",active:true}
  ]);}
  if(await Resource.countDocuments()===0){await Resource.insertMany([
    {title:"IMMIQ Learning Starter Guide",description:"A starter guide for learners.",type:"Notes",url:"/resources/immiq-learning-starter-guide",active:true,order:1},
    {title:"How to Build a Strong Learning Routine",description:"A practical guide for turning lessons into consistent project work.",type:"PDF",url:"/resources/learning-routine",active:true,order:2},
    {title:"Project Review Checklist",description:"Use this checklist before submitting a practical project for review.",type:"Assignment",url:"/resources/project-review-checklist",active:true,order:3},
    {title:"IMMIQ Learning Video Library",description:"A curated starting point for technology learning videos.",type:"Video",url:"https://www.youtube.com/",active:true,order:4}
  ]);}
  console.log("✅ Phase 2 seed data checked");
};
