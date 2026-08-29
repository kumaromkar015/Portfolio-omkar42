import { Schema, model, Document } from "mongoose";

export interface IExperience extends Document {
  company: string; // Will double as Organization
  position: string; // Will double as Role/Degree/Title
  duration: string; // Will double as Date/Timeline marker
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  type: "work" | "education" | "project" | "goal";
  displayOrder: number;
  isVisible: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    responsibilities: [String],
    technologies: [String],
    achievements: [String],
    type: {
      type: String,
      enum: ["work", "education", "project", "goal"],
      default: "work",
    },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

experienceSchema.index({ displayOrder: 1 });
experienceSchema.index({ type: 1 });
experienceSchema.index({ isVisible: 1 });

export const Experience = model<IExperience>("Experience", experienceSchema);
