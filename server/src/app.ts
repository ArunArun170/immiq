import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import publicRoutes from "./routes/publicRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

import clientRoutes from "./routes/clientRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import blogRoutes from "./routes/blogRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import leadRoutes from "./routes/leadRoutes";
import teamRoutes from "./routes/teamRoutes";
import testimonialRoutes from "./routes/testimonialRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import userRoutes from "./routes/userRoutes";

import BlogPost from "./models/BlogPost";


import courseRoutes from "./routes/courseRoutes";
import batchRoutes from "./routes/batchRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

import paymentRoutes from "./routes/paymentRoutes";
import learningRoutes from "./routes/learningRoutes";
import courseContentRoutes from "./routes/courseContentRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import eventRoutes from "./routes/eventRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import newsletterRoutes from "./routes/newsletterRoutes";
import interestRoutes from "./routes/interestRoutes";
import corporateRoutes from "./routes/corporateRoutes";
import learnerProfileRoutes from "./routes/learnerProfileRoutes";

const app = express();

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://immiq.vercel.app",
];

app.use(
  cors({
    origin: (
      origin,
      callback
    ) => {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "Not allowed by CORS"
          )
        );
      }
    },
    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* =========================
   HEALTH CHECK
========================= */

app.get(
  "/api/v1/health",
  (_req: express.Request, res: express.Response) => {
    res.status(200).json({
      success: true,
      message: "IMMIQ API is running",
    });
  }
);

/* =========================
   ROBOTS.TXT
========================= */

app.get(
  "/robots.txt",
  (_req: express.Request, res: express.Response) => {
    res.type("text/plain");

    res.send(
      `User-agent: *
Allow: /

Sitemap: https://immiq.vercel.app/sitemap.xml
`
    );
  }
);

/* =========================
   SITEMAP.XML
========================= */

app.get(
  "/sitemap.xml",
  async (
    _req: express.Request,
    res: express.Response
  ) => {
    try {
      const baseUrl =
        "https://immiq.vercel.app";

      const staticRoutes = [
        "/",
        "/about",
        "/training",
        "/saas",
        "/technology",
        "/services",
        "/clients",
        "/achievements",
        "/blog",
        "/contact",
      ];

      const blogs =
        await BlogPost.find({
          published: true,
        })
          .select(
            "slug updatedAt"
          )
          .sort({
            updatedAt: -1,
          })
          .lean();

      const staticUrls =
        staticRoutes
          .map(
            (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${
      route === "/"
        ? "1.0"
        : "0.8"
    }</priority>
  </url>`
          )
          .join("");

      const blogUrls =
        blogs
          .map(
            (blog) => `
  <url>
    <loc>${baseUrl}/blog/${encodeURIComponent(
              blog.slug
            )}</loc>
    <lastmod>${new Date(
      blog.updatedAt
    ).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
          )
          .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${staticUrls}
${blogUrls}
</urlset>`;

      res
        .type("application/xml")
        .send(xml);
    } catch (error) {
      console.error(
        "Sitemap generation error:",
        error
      );

      res
        .status(500)
        .send(
          "Unable to generate sitemap"
        );
    }
  }
);

/* =========================
   PUBLIC ROUTES
========================= */

app.use(
  "/api/v1/public",
  publicRoutes
);

/* =========================
   AUTH ROUTES
========================= */

app.use(
  "/api/v1/auth",
  authRoutes
);

/* =========================
   ADMIN DASHBOARD
========================= */

app.use(
  "/api/v1/admin",
  adminRoutes
);

/* =========================
   CLIENT CMS
========================= */

app.use(
  "/api/v1/admin/clients",
  clientRoutes
);

/* =========================
   ACHIEVEMENT CMS
========================= */

app.use(
  "/api/v1/admin/achievements",
  achievementRoutes
);

/* =========================
   BLOG CMS
========================= */

app.use(
  "/api/v1/admin/blog",
  blogRoutes
);

/* =========================
   SERVICE CMS
========================= */

app.use(
  "/api/v1/admin/services",
  serviceRoutes
);

/* =========================
   LEADS CRM
========================= */

app.use(
  "/api/v1/admin/leads",
  leadRoutes
);

/* =========================
   TEAM CMS
========================= */

app.use(
  "/api/v1/admin/team",
  teamRoutes
);

/* =========================
   TESTIMONIAL CMS
========================= */

app.use(
  "/api/v1/admin/testimonials",
  testimonialRoutes
);

/* =========================
   MEDIA CMS
========================= */

app.use(
  "/api/v1/admin/media",
  mediaRoutes
);

/* =========================
   USERS & ROLES CMS
========================= */

app.use(
  "/api/v1/admin/users",
  userRoutes
);





app.use(
  "/api/v1",
  courseRoutes
);

app.use(
  "/api/v1",
  batchRoutes
);

app.use("/api/v1", enrollmentRoutes);

app.use("/api/v1", paymentRoutes);
app.use("/api/v1", learningRoutes);
app.use("/api/v1", courseContentRoutes);
app.use("/api/v1", certificateRoutes);
app.use("/api/v1", invoiceRoutes);
app.use("/api/v1", eventRoutes);
app.use("/api/v1", resourceRoutes);
app.use("/api/v1", newsletterRoutes);
app.use("/api/v1", interestRoutes);
app.use("/api/v1", corporateRoutes);
app.use("/api/v1", learnerProfileRoutes);


/* =========================
   SETTINGS
========================= */

app.use(
  "/api/v1/settings",
  settingsRoutes
);

/* =========================
   404 HANDLER
========================= */

app.use(
  (
    _req: express.Request,
    res: express.Response
  ) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
);

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(
      "Global server error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

export default app;