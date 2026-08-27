import { Router, Response } from "express";
import multer from "multer";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { MediaService } from "../services/mediaService.js";
import { Media } from "../models/media.js";
import { Profile } from "../models/profile.js";
import { Project } from "../models/projects.js";
import { Blog } from "../models/blog.js";

const router = Router();

// Configure multer memory storage (limit size to 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function validateExternalUrl(urlStr: string): { isValid: boolean; resourceType: string; mimeType: string; format: string; error?: string } {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { isValid: false, resourceType: "", mimeType: "", format: "", error: "Only HTTP and HTTPS protocols are allowed" };
    }
    
    const pathname = parsed.pathname.toLowerCase();
    let format = "";
    let mimeType = "application/octet-stream";
    let resourceType = "raw";
    
    // Attempt to identify standard extensions
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
      format = "jpg";
      mimeType = "image/jpeg";
      resourceType = "image";
    } else if (pathname.endsWith(".png")) {
      format = "png";
      mimeType = "image/png";
      resourceType = "image";
    } else if (pathname.endsWith(".webp")) {
      format = "webp";
      mimeType = "image/webp";
      resourceType = "image";
    } else if (pathname.endsWith(".gif")) {
      format = "gif";
      mimeType = "image/gif";
      resourceType = "image";
    } else if (pathname.endsWith(".svg")) {
      format = "svg";
      mimeType = "image/svg+xml";
      resourceType = "image";
    } else if (pathname.endsWith(".pdf")) {
      format = "pdf";
      mimeType = "application/pdf";
      resourceType = "raw";
    }

    return { isValid: true, resourceType, mimeType, format };
  } catch (err) {
    return { isValid: false, resourceType: "", mimeType: "", format: "", error: "Malformed URL" };
  }
}

// Upload File (Protected)
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      throw new AppError("No file provided", 400);
    }

    const folder = (req.body.folder as string) || "portfolio/general";
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    const userId = req.user?.id;

    const media = await MediaService.uploadFile(
      fileBuffer,
      originalName,
      mimeType,
      folder,
      userId
    );

    res.status(201).json({
      success: true,
      data: media,
    });
  })
);

// Add External Media URL (Protected)
router.post(
  "/url",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { url, resourceType, mimeType, altText, caption } = req.body;

    if (!url) {
      throw new AppError("URL is required", 400);
    }

    const validation = validateExternalUrl(url);
    if (!validation.isValid) {
      throw new AppError(validation.error || "Invalid URL", 400);
    }

    // Merge detected details with payload overrides if provided
    const finalResourceType = resourceType || validation.resourceType || "raw";
    const finalMimeType = mimeType || validation.mimeType || "application/octet-stream";
    const finalFormat = validation.format || url.split(".").pop()?.split(/[?#]/)[0] || "";
    const originalFilename = url.split("/").pop()?.split(/[?#]/)[0] || "external-media";

    const media = new Media({
      source: "external",
      secureUrl: url,
      resourceType: finalResourceType,
      type: finalMimeType,
      format: finalFormat,
      originalFilename,
      folder: "portfolio/external",
      altText,
      caption,
      createdBy: req.user?.id,
    });

    await media.save();

    res.status(201).json({
      success: true,
      data: media,
    });
  })
);

// Get All Media (Protected, for admin library)
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const type = req.query.type as string; // 'all' | 'image' | 'pdf' | 'external' | 'cloudinary'
    const folder = req.query.folder as string;
    const search = req.query.search as string;
    const source = req.query.source as string; // 'all' | 'cloudinary' | 'external'

    const query: any = {};

    if (type && type !== "all") {
      if (type === "image") {
        query.resourceType = "image";
      } else if (type === "pdf") {
        query.type = "application/pdf";
      }
    }

    if (source && source !== "all") {
      query.source = source;
    }

    if (folder) {
      query.folder = folder;
    }

    if (search) {
      query.$or = [
        { originalFilename: { $regex: search, $options: "i" } },
        { publicId: { $regex: search, $options: "i" } },
        { secureUrl: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Media.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const mediaList = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        media: mediaList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  })
);

// Check References before deletion
router.get(
  "/:id/references",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const media = await Media.findById(id);
    if (!media) {
      throw new AppError("Media not found", 404);
    }

    const url = media.secureUrl;
    const references: { type: string; name: string }[] = [];

    // Profile check
    const profile = await Profile.findOne({
      $or: [{ photo: url }, { resumeUrl: url }],
    });
    if (profile) {
      references.push({ type: "Profile", name: profile.name });
    }

    // Projects check
    const projects = await Project.find({
      $or: [{ coverImage: url }, { gallery: url }],
    });
    for (const p of projects) {
      references.push({ type: "Project", name: p.title });
    }

    // Blogs check
    const blogs = await Blog.find({ coverImage: url });
    for (const b of blogs) {
      references.push({ type: "Blog", name: b.title });
    }

    res.json({
      success: true,
      isReferenced: references.length > 0,
      references,
    });
  })
);

// Delete Media (Protected)
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    await MediaService.deleteMedia(id);
    res.json({
      success: true,
      message: "Media record deleted successfully",
    });
  })
);

export default router;
