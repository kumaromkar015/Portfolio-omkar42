import { Router, Request, Response } from "express";
import { Skill } from "../models/skill.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSkillSchema, updateSkillSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get All Skills (Public)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const skills = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: skills });
  })
);

// Create Skill (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createSkillSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json({ success: true, data: skill });
  })
);

// Update Skill (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateSkillSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      throw new AppError("Skill not found", 404);
    }
    Object.assign(skill, req.body);
    await skill.save();
    res.json({ success: true, data: skill });
  })
);

// Delete Skill (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      throw new AppError("Skill not found", 404);
    }
    res.json({ success: true, message: "Skill deleted successfully" });
  })
);

export default router;
