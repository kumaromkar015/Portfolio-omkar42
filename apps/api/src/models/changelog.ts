import { Schema, model, Document, Types } from "mongoose";

export interface IChangelog extends Document {
  title: string;
  description: string;
  date: string; // e.g. "AUG 2026"
  category: "portfolio" | "project" | "career" | "skill" | "other";
  relatedProject?: Types.ObjectId;
  imageUrl?: string;
  link?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const changelogSchema = new Schema<IChangelog>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    category: {
      type: String,
      enum: ["portfolio", "project", "career", "skill", "other"],
      default: "portfolio",
    },
    relatedProject: { type: Schema.Types.ObjectId, ref: "Project" },
    imageUrl: { type: String },
    link: { type: String },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

changelogSchema.index({ displayOrder: 1 });
changelogSchema.index({ category: 1 });
changelogSchema.index({ isPublished: 1 });

export const Changelog = model<IChangelog>("Changelog", changelogSchema);
