import { Router, Request, Response } from "express";
import { Testimonial } from "../models/testimonials.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createTestimonialSchema, updateTestimonialSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Testimonials (Public)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const all = req.query.all === "true"; // Admin can view invisible drafts
    const query: any = {};
    if (!all) {
      query.isVisible = true;
    }

    const list = await Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: list });
  })
);

// Create Testimonial (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createTestimonialSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = new Testimonial(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  })
);

// Update Testimonial (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateTestimonialSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      throw new AppError("Testimonial not found", 404);
    }
    res.json({ success: true, data: item });
  })
);

// Delete Testimonial (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new AppError("Testimonial not found", 404);
    }
    res.json({ success: true, message: "Testimonial deleted successfully" });
  })
);

export default router;
