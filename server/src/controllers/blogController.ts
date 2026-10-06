import { Response } from "express";

import BlogPost from "../models/BlogPost";
import { AuthRequest } from "../middleware/auth";

/* =========================
   GET ALL BLOG POSTS
========================= */

export const getBlogPosts = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const posts = await BlogPost.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get blog posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
    });
  }
};

/* =========================
   GET SINGLE BLOG POST
========================= */

export const getBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get blog post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog post",
    });
  }
};

/* =========================
   CREATE BLOG POST
========================= */

export const createBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      readTime,
      featured,
      published,
      publishedAt,
      image,
      tags,
    } = req.body;

    if (
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !category ||
      !author
    ) {
      res.status(400).json({
        success: false,
        message:
          "Title, slug, excerpt, content, category and author are required",
      });
      return;
    }

    const existingPost = await BlogPost.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existingPost) {
      res.status(409).json({
        success: false,
        message: "A blog post with this slug already exists",
      });
      return;
    }

    const post = await BlogPost.create({
      title,
      slug: slug.toLowerCase().trim(),
      excerpt,
      content,
      category,
      author,
      readTime: Number(readTime) || 5,
      featured: Boolean(featured),
      published: Boolean(published),
      publishedAt:
        published && publishedAt
          ? new Date(publishedAt)
          : published
            ? new Date()
            : undefined,
      image: image || "",
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create blog post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create blog post",
    });
  }
};

/* =========================
   UPDATE BLOG POST
========================= */

export const updateBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    if (updateData.slug) {
      updateData.slug = updateData.slug
        .toLowerCase()
        .trim();
    }

    if (updateData.readTime !== undefined) {
      updateData.readTime = Number(updateData.readTime) || 5;
    }

    if (updateData.tags !== undefined) {
      updateData.tags = Array.isArray(updateData.tags)
        ? updateData.tags
        : [];
    }

    if (updateData.published === true) {
      updateData.publishedAt =
        updateData.publishedAt || new Date();
    }

    if (updateData.published === false) {
      updateData.publishedAt = undefined;
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update blog post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update blog post",
    });
  }
};

/* =========================
   DELETE BLOG POST
========================= */

export const deleteBlogPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog post error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
    });
  }
};