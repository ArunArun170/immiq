import { Router, Request, Response } from "express";
import Client from "../models/Client";
import Achievement from "../models/Achievement";
import BlogPost from "../models/BlogPost";
import { createLead } from "../controllers/leadController";

const router = Router();

/**
 * Get Clients
 */
router.get("/clients", async (_req: Request, res: Response) => {
  try {
    const clients = await Client.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
});

/**
 * Get Achievements
 */
router.get(
  "/achievements",
  async (_req: Request, res: Response) => {
    try {
      const achievements = await Achievement.find()
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        count: achievements.length,
        data: achievements,
      });
    } catch (error) {
      console.error("Get achievements error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch achievements",
      });
    }
  }
);

/**
 * Get Published Blog Posts
 */
router.get("/blog", async (_req: Request, res: Response) => {
  try {
    const posts = await BlogPost.find({
      published: true,
    })
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get blog posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
    });
  }
});

/**
 * Get Single Blog Post
 */
router.get(
  "/blog/:slug",
  async (req: Request, res: Response) => {
    try {
      const post = await BlogPost.findOne({
        slug: req.params.slug,
        published: true,
      }).lean();

      if (!post) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error("Get blog post error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch blog post",
      });
    }
  }
);

/**
 * Home Page Data
 *
 * Returns only the content required
 * for the public home page.
 */
router.get("/home", async (_req: Request, res: Response) => {
  try {
    const [featuredClients, featuredAchievements, latestBlogs] =
      await Promise.all([
        Client.find({
          featured: true,
        })
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),

        Achievement.find({
          featured: true,
        })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),

        BlogPost.find({
          published: true,
        })
          .sort({
            publishedAt: -1,
            createdAt: -1,
          })
          .limit(3)
          .lean(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        clients: featuredClients,
        achievements: featuredAchievements,
        blogs: latestBlogs,
      },
    });
  } catch (error) {
    console.error("Get home data error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home page data",
    });
  }
});

router.post("/leads", createLead);


export default router;