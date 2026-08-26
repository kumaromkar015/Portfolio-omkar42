import { Schema, model, Document } from "mongoose";

export interface IMedia extends Document {
  source: "cloudinary" | "external";
  publicId?: string;
  secureUrl: string;    // Will store the secure URL (Cloudinary or External)
  resourceType: string; // 'image' | 'raw' | 'video'
  type: string;         // MIME type, e.g. 'image/jpeg', 'application/pdf'
  format?: string;       // e.g. webp, pdf
  originalFilename?: string;
  folder?: string;
  bytes?: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  createdBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    source: { type: String, enum: ["cloudinary", "external"], default: "cloudinary", required: true },
    publicId: { type: String, sparse: true }, // unique and sparse since external media won't have it
    secureUrl: { type: String, required: true },
    resourceType: { type: String, required: true },
    type: { type: String, required: true },
    format: { type: String },
    originalFilename: { type: String },
    folder: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    altText: { type: String },
    caption: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes
mediaSchema.index({ publicId: 1 });
mediaSchema.index({ folder: 1 });
mediaSchema.index({ source: 1 });
mediaSchema.index({ createdAt: -1 });

export const Media = model<IMedia>("Media", mediaSchema);
