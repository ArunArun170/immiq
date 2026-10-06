import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db";
import { seedClients } from "./seed/clients";
import { seedAchievements } from "./seed/achievements";
import { seedBlogPosts } from "./seed/blogPosts";
import { seedAdmin } from "./seed/admin";
import { seedPhase2 } from "./seed/phase2";
import { seedCorporate } from "./seed/corporate";

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDB();

    await seedClients();
    await seedAchievements();
    await seedBlogPosts();
    await seedAdmin();
    await seedPhase2();
    await seedCorporate();

    console.log("🎉 IMMIQ database seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();