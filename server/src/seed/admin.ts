import bcrypt from "bcryptjs";
import User from "../models/User";

export const seedAdmin = async (): Promise<void> => {
  const email = "admin@immiq.in";

  const existingAdmin = await User.findOne({
    email,
  });

  if (existingAdmin) {
    console.log("ℹ️ Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    "Admin@12345",
    12
  );

  await User.create({
    name: "IMMIQ Admin",

    email,

    password: hashedPassword,

    role: "super_admin",

    permissions: [
      /* =========================
         DASHBOARD
      ========================= */

      "dashboard:read",

      /* =========================
         CLIENTS
      ========================= */

      "client:create",
      "client:read",
      "client:update",
      "client:delete",

      /* =========================
         ACHIEVEMENTS
      ========================= */

      "achievement:create",
      "achievement:read",
      "achievement:update",
      "achievement:delete",

      /* =========================
         BLOG
      ========================= */

      "blog:create",
      "blog:read",
      "blog:update",
      "blog:delete",

      /* =========================
         SERVICES
      ========================= */

      "service:create",
      "service:read",
      "service:update",
      "service:delete",

      /* =========================
         LEADS
      ========================= */

      "lead:read",
      "lead:update",

      /* =========================
         TEAM
      ========================= */

      "team:create",
      "team:read",
      "team:update",
      "team:delete",

      /* =========================
         USERS
      ========================= */

      "user:create",
      "user:read",
      "user:update",
      "user:delete",


    /* =========================
    TESTIMONIALS
    ========================= */

    "testimonial:create",
    "testimonial:read",
    "testimonial:update",
    "testimonial:delete",


    /* =========================
    USERS
    ========================= */
    "user:create",
    "user:read",
    "user:update",
    "user:delete",


    /* =========================
    MEDIA
    ========================= */
    "media:create",
    "media:read",
    "media:update",
    "media:delete",



      /* =========================
         SETTINGS
      ========================= */

      "settings:read",
      "settings:update",

      /* =========================
         CERTIFICATES
      ========================= */

      "certificate:read",
      "certificate:update",
    ],

    isActive: true,
  });

  console.log("✅ Admin user created");
};