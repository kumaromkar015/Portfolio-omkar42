import { Router, Request, Response } from "express";
import { GalleryItem } from "../models/gallery.js";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createGalleryItemSchema, updateGalleryItemSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get Gallery Items (Public / Admin)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const all = req.query.all === "true"; // Admin can view hidden items
    const category = req.query.category as string;

    const query: any = {};
    if (!all) {
      query.isVisible = true;
    }
    if (category && category !== "all") {
      query.category = category;
    }

    const items = await GalleryItem.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  })
);

// Create Gallery Item (Protected)
router.post(
  "/",
  authMiddleware,
  validate(createGalleryItemSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const itemData = req.body;
    
    // Parse date if present and empty
    if (itemData.date === "") {
      itemData.date = undefined;
    }

    const item = new GalleryItem({
      ...itemData,
    });

    await item.save();
    res.status(201).json({ success: true, data: item });
  })
);

// Update Gallery Item (Protected)
router.put(
  "/:id",
  authMiddleware,
  validate(updateGalleryItemSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const itemData = req.body;

    // Handle date formatting
    if (itemData.date === "") {
      itemData.date = undefined;
    }

    const item = await GalleryItem.findByIdAndUpdate(id, itemData, { new: true });
    if (!item) {
      throw new AppError("Gallery item not found", 404);
    }

    res.json({ success: true, data: item });
  })
);

// Delete Gallery Item (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      throw new AppError("Gallery item not found", 404);
    }

    res.json({ success: true, message: "Gallery item deleted successfully" });
  })
);

export default router;
