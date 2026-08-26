import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

const router = Router();

// Upload image (Protected)
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { image, folder = 'portfolio' } = req.body;

    if (!image) {
      throw new AppError('Image data is required', 400);
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  })
);

// Delete image (Protected) — accepts publicId in request body since
// Cloudinary public IDs contain slashes (e.g. "portfolio/image_name")
router.delete(
  '/',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.body;

    if (!publicId || typeof publicId !== 'string') {
      throw new AppError('Public ID is required', 400);
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw new AppError('Failed to delete image from Cloudinary', 500);
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  })
);

export default router;
