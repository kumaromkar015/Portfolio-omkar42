import { Router, Request, Response } from "express";
import { Education } from "../models/education.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createEducationSchema, updateEducationSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Education Milestones
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const education = await Education.find().sort({ createdAt: -1 });
    res.json({ success: true, data: education });
  })
);

// Create Education (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createEducationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const edu = new Education(req.body);
    await edu.save();
    res.status(201).json({ success: true, data: edu });
  })
);

// Update Education (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateEducationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!edu) {
      throw new AppError("Education record not found", 404);
    }
    res.json({ success: true, data: edu });
  })
);

// Delete Education (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) {
      throw new AppError("Education record not found", 404);
    }
    res.json({ success: true, message: "Education record deleted successfully" });
  })
);

export default router;
