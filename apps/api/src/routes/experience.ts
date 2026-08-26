import { Router, Request, Response } from "express";
import { Experience } from "../models/experience.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createExperienceSchema, updateExperienceSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Experiences
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const experiences = await Experience.find().sort({ createdAt: -1 });
    res.json({ success: true, data: experiences });
  })
);

// Create Experience (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createExperienceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json({ success: true, data: exp });
  })
);

// Update Experience (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateExperienceSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) {
      throw new AppError("Experience record not found", 404);
    }
    res.json({ success: true, data: exp });
  })
);

// Delete Experience (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      throw new AppError("Experience record not found", 404);
    }
    res.json({ success: true, message: "Experience record deleted successfully" });
  })
);

export default router;
