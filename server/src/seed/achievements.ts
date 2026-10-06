import Achievement from "../models/Achievement";

const achievements = [
  {
    title: "IMMIQ officially launched in Coimbatore",
    description:
      "IMMIQ officially began its journey with a focus on curiosity-first technology learning and innovation.",
    date: "January 2026",
    category: "Milestone",
    featured: true,
  },
  {
    title: "First corporate training batch completed",
    description:
      "The first corporate training batch was completed with 100% project completion.",
    date: "March 2026",
    category: "Milestone",
    featured: true,
  },
  {
    title: "Featured as an emerging technology startup to watch",
    description:
      "IMMIQ was featured in a demo technology publication highlighting emerging technology training companies.",
    date: "April 2026",
    category: "Media",
    featured: false,
  },
  {
    title: "Spatial Computing Lab prototype showcased",
    description:
      "An early Spatial Computing Lab prototype was showcased at a regional technology summit.",
    date: "May 2026",
    category: "Award",
    featured: true,
  },
  {
    title: "First AI-powered SaaS product delivered",
    description:
      "IMMIQ delivered its first AI-powered SaaS product for a retail client.",
    date: "June 2026",
    category: "Milestone",
    featured: true,
  },
  {
    title: "500+ learners trained",
    description:
      "IMMIQ crossed the milestone of training more than 500 learners across colleges and companies.",
    date: "July 2026",
    category: "Milestone",
    featured: true,
  },
  {
    title: "Engineering college network partnership",
    description:
      "IMMIQ entered into a partnership MoU with an engineering college network.",
    date: "August 2026",
    category: "Partnership",
    featured: false,
  },
  {
    title: "Cloud partner programme enrolment",
    description:
      "IMMIQ joined a cloud partner programme to strengthen its cloud technology capabilities.",
    date: "September 2026",
    category: "Certification",
    featured: false,
  },
];

export const seedAchievements = async (): Promise<void> => {
  await Achievement.deleteMany({});
  await Achievement.insertMany(achievements);

  console.log(`✅ Seeded ${achievements.length} achievements`);
};