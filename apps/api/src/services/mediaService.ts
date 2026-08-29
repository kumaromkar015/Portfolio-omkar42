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
    // Validate MIME types and file extensions
    const fileExt = originalName.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf", "mp4", "webm", "ogg", "mov", "avi"];
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo"
    ];

    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new AppError(
        "Invalid file extension. Allowed types: JPG, JPEG, PNG, WEBP, GIF, PDF, MP4, WEBM, OGG, MOV, AVI",
        400
      );
    }

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new AppError(
        "Invalid MIME type. Allowed types: JPG, JPEG, PNG, WEBP, GIF, PDF, MP4, WEBM, OGG, MOV, AVI",
        400
      );
    }

    const isPdf = mimeType === "application/pdf" || fileExt === "pdf";
    const isVideo = mimeType.startsWith("video/") || ["mp4", "webm", "ogg", "mov", "avi"].includes(fileExt);

    let resourceType = "image";
    if (isPdf) resourceType = "raw";
    else if (isVideo) resourceType = "video";

    const options: any = {
      folder: folder || "portfolio/general",
      resource_type: resourceType,
    };

    if (isPdf) {
      const fileExt = originalName.split(".").pop() || "pdf";
      const baseName = originalName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "_"); // sanitize filename characters
      options.public_id = `${baseName}_${Math.round(Date.now() / 1000)}.${fileExt}`;
    }

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
