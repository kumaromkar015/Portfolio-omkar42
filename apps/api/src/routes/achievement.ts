import { Router, Request, Response } from "express";
import { Achievement } from "../models/achievement.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createAchievementSchema, updateAchievementSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Achievements
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: achievements });
  })
);

// Create Achievement (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createAchievementSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const ach = new Achievement(req.body);
    await ach.save();
    res.status(201).json({ success: true, data: ach });
  })
);

// Update Achievement (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateAchievementSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const ach = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ach) {
      throw new AppError("Achievement record not found", 404);
    }
    res.json({ success: true, data: ach });
  })
);

// Delete Achievement (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const ach = await Achievement.findByIdAndDelete(req.params.id);
    if (!ach) {
      throw new AppError("Achievement record not found", 404);
    }
    res.json({ success: true, message: "Achievement record deleted successfully" });
  })
);

export default router;
