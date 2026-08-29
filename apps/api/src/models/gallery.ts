import { Schema, model, Document } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: "professional" | "work" | "events" | "achievements" | "journey";
  date?: Date;
  location?: string;
  altText?: string;
  isFeatured: boolean;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["professional", "work", "events", "achievements", "journey"],
      required: true,
    },
    date: { type: Date },
    location: { type: String },
    altText: { type: String },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
galleryItemSchema.index({ displayOrder: 1 });
galleryItemSchema.index({ category: 1 });
galleryItemSchema.index({ isVisible: 1 });

export const GalleryItem = model<IGalleryItem>("GalleryItem", galleryItemSchema);
