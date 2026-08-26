import { Schema, model } from "mongoose";

const experienceSchema = new Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    duration: { type: String, required: true },
    responsibilities: [String],
    technologies: [String],
    achievements: [String],
  },
  { timestamps: true }
);

export const Experience = model("Experience", experienceSchema);
