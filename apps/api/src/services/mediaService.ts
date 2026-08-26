import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import { Media, IMedia } from "../models/media.js";
import { AppError } from "../middleware/errorHandler.js";

export class MediaService {
  /**
   * Uploads a buffer to Cloudinary and saves the metadata to MongoDB.
   */
  static async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string,
    userId?: string
  ): Promise<IMedia> {
    // Validate MIME types
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new AppError(
        "Invalid file type. Allowed types: JPG, PNG, WEBP, GIF, PDF",
        400
      );
    }

    const isPdf = mimeType === "application/pdf";
    const resourceType = isPdf ? "raw" : "image";

    const options: any = {
      folder: folder || "portfolio/general",
      resource_type: resourceType,
    };

    // Auto transformation for images only (PDFs/raw files will fail transformations)
    if (resourceType === "image") {
      options.transformation = [{ quality: "auto", fetch_format: "auto" }];
    }

    try {
      // Cloudinary upload stream
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(fileBuffer).pipe(uploadStream);
      });

      const format = result.format || originalName.split(".").pop() || "";

      const media = new Media({
        source: "cloudinary",
        publicId: result.public_id,
        secureUrl: result.secure_url,
        resourceType,
        type: mimeType,
        format,
        originalFilename: originalName,
        folder: options.folder,
        bytes: result.bytes,
        width: result.width || undefined,
        height: result.height || undefined,
        createdBy: userId,
      });

      await media.save();
      return media;
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      throw new AppError(err.message || "Failed to upload file to Cloudinary", 500);
    }
  }

  /**
   * Deletes media from Cloudinary (if cloudinary source) and MongoDB.
   */
  static async deleteMedia(id: string): Promise<boolean> {
    const media = await Media.findById(id);
    if (!media) {
      throw new AppError("Media not found", 404);
    }

    if (media.source === "cloudinary" && media.publicId) {
      try {
        // PDF or other raw files require resource_type: "raw"
        const result = await cloudinary.uploader.destroy(media.publicId, {
          resource_type: media.resourceType === "raw" ? "raw" : "image",
        });

        if (result.result !== "ok" && result.result !== "not found") {
          throw new AppError(`Cloudinary destruction failed: ${result.result}`, 500);
        }
      } catch (err: any) {
        console.warn("Cloudinary asset deletion error (proceeding to delete DB record):", err);
      }
    }

    await Media.findByIdAndDelete(id);
    return true;
  }
}
