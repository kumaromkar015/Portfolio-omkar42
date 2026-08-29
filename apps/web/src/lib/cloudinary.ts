/**
 * Utility helper for Cloudinary URL normalization and manipulation.
 */

export interface CloudinaryAssetInfo {
  resourceType: "image" | "raw" | "video";
  publicId: string;
  secureUrl: string;
  downloadUrl: string;
  previewUrl: string;
  fileName: string;
}

/**
 * Parses and normalizes any media URL to extract details and generate helper URLs.
 */
export function parseMediaUrl(url: string): CloudinaryAssetInfo | null {
  if (!url) return null;

  const cleanUrl = url.split("?")[0].trim();
  const isCloudinary = cleanUrl.includes("cloudinary.com");

  if (!isCloudinary) {
    const fileName = cleanUrl.split("/").pop()?.split(/[?#]/)[0] || "external-file";
    const isPdf = cleanUrl.toLowerCase().endsWith(".pdf");
    const isVideo = cleanUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i);
    
    let resourceType: "image" | "raw" | "video" = "image";
    if (isPdf) resourceType = "raw";
    else if (isVideo) resourceType = "video";

    return {
      resourceType,
      publicId: "",
      secureUrl: url,
      downloadUrl: url,
      previewUrl: url,
      fileName,
    };
  }

  try {
    // Match the parts of a Cloudinary URL
    // e.g. https://res.cloudinary.com/cloud_name/raw/upload/v1234/folder/file.pdf
    const regex = /res\.cloudinary\.com\/([^/]+)\/(image|video|raw)\/(upload|authenticated|private)\/(?:v\d+\/)?(.+)$/;
    const match = cleanUrl.match(regex);

    if (!match) {
      const isPdf = cleanUrl.toLowerCase().endsWith(".pdf") || cleanUrl.includes("/raw/upload/");
      const isVideo = cleanUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i) || cleanUrl.includes("/video/upload/");
      const fileName = cleanUrl.split("/").pop()?.split(/[?#]/)[0] || "cloudinary-file";
      
      let resourceType: "image" | "raw" | "video" = "image";
      if (isPdf) resourceType = "raw";
      else if (isVideo) resourceType = "video";

      return {
        resourceType,
        publicId: "",
        secureUrl: url,
        downloadUrl: url,
        previewUrl: url,
        fileName,
      };
    }

    const [_, cloudName, resourceTypeStr, deliveryType, publicIdWithExt] = match;
    const resourceType = resourceTypeStr as "image" | "raw" | "video";
    const fileName = publicIdWithExt.split("/").pop() || "file";
    
    // Construct download URL using fl_attachment for raw files
    const baseDeliveryUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/${deliveryType}`;
    const downloadUrl = resourceType === "raw"
      ? `${baseDeliveryUrl}/fl_attachment/${publicIdWithExt}`
      : url;

    return {
      resourceType,
      publicId: publicIdWithExt.replace(/\.[^/.]+$/, ""),
      secureUrl: url,
      downloadUrl,
      previewUrl: url,
      fileName,
    };
  } catch (e) {
    console.error("Error parsing Cloudinary URL:", e);
    return {
      resourceType: "raw",
      publicId: "",
      secureUrl: url,
      downloadUrl: url,
      previewUrl: url,
      fileName: "file",
    };
  }
}
