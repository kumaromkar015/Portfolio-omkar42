import { Schema, model } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Database", "Languages", "Cloud & DevOps", "Tools & Design"],
    },
    iconName: { type: String, default: "Code2" },
    iconUrl: { type: String, default: "" },
    progress: { type: Number, min: 0, max: 100, default: 80 },
    experienceLevel: {
      type: String,
      enum: ["Expert", "Advanced", "Intermediate"],
      default: "Advanced",
    },
    years: { type: Number, min: 0, default: 1 },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, displayOrder: 1 });
SkillSchema.index({ status: 1 });

export const Skill = model("Skill", SkillSchema);
