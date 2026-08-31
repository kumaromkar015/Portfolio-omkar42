import { Schema, model, Document } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  type: "hackathon" | "cert" | "award" | "milestone" | "course" | "recognition";
  date?: string;
  description?: string;
  issuer?: string; // Organization
  link?: string; // Credential URL
  imageUrl?: string;
  certificateUrl?: string; // Certificate PDF
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["hackathon", "cert", "award", "milestone", "course", "recognition"],
      default: "cert",
    },
    date: { type: String },
    description: { type: String },
    issuer: { type: String },
    link: { type: String },
    imageUrl: { type: String },
    certificateUrl: { type: String },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

achievementSchema.index({ displayOrder: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ isVisible: 1 });

export const Achievement = model<IAchievement>("Achievement", achievementSchema);
