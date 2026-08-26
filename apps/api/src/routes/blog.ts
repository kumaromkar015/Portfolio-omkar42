import { Router, Request, Response } from "express";
import { Blog } from "../models/blog.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBlogSchema, updateBlogSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get All Blogs
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { all } = req.query;
    const query = all === "true" ? {} : { published: true };
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  })
);

// Get Blog by Slug
router.get(
  "/:slug",
  asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      throw new AppError("Article not found", 404);
    }
    res.json({ success: true, data: blog });
  })
);

// Create Blog Post (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createBlogSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  })
);

// Update Blog Post (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateBlogSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      throw new AppError("Article not found", 404);
    }
    res.json({ success: true, data: blog });
  })
);

// Delete Blog Post (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      throw new AppError("Article not found", 404);
    }
    res.json({ success: true, message: "Article deleted successfully" });
  })
);

export default router;
