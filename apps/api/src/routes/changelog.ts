import { Router, Request, Response } from "express";
import { Changelog } from "../models/changelog.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createChangelogSchema, updateChangelogSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Changelogs
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const all = req.query.all === "true"; // Admin can view unpublished drafts
    const query: any = {};
    if (!all) {
      query.isPublished = true;
    }

    const changelogs = await Changelog.find(query)
      .populate("relatedProject", "title slug")
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({ success: true, data: changelogs });
  })
);

// Create Changelog (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createChangelogSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if (!payload.relatedProject) {
      delete payload.relatedProject;
    }
    const cl = new Changelog(payload);
    await cl.save();
    res.status(201).json({ success: true, data: cl });
  })
);

// Update Changelog (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateChangelogSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body };
    if (payload.relatedProject === "" || payload.relatedProject === null) {
      payload.relatedProject = undefined;
    }
    const cl = await Changelog.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!cl) {
      throw new AppError("Changelog entry not found", 404);
    }
    res.json({ success: true, data: cl });
  })
);

// Delete Changelog (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const cl = await Changelog.findByIdAndDelete(req.params.id);
    if (!cl) {
      throw new AppError("Changelog entry not found", 404);
    }
    res.json({ success: true, message: "Changelog entry deleted successfully" });
  })
);

export default router;
