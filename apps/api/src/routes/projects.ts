import { Router, Request, Response } from "express";
import { Project } from "../models/projects.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get All Projects
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, data: projects });
  })
);

// Get Project by slug or ID
router.get(
  "/:identifier",
  asyncHandler(async (req: Request, res: Response) => {
    const identifier = req.params.identifier as string;
    // Try slug first, then ObjectId
    let project = await Project.findOne({ slug: identifier });
    if (!project) {
      // Check if it's a valid ObjectId
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        project = await Project.findById(identifier);
      }
    }
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    res.json({ success: true, data: project });
  })
);

// Create Project (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    // Auto-generate slug from title if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project });
  })
);

// Update Project (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateProjectSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    res.json({ success: true, data: project });
  })
);

// Delete Project (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    res.json({ success: true, message: "Project deleted successfully" });
  })
);

export default router;
