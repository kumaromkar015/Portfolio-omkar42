import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		techStack: [String], // ['Next.js', 'MongoDB', 'Express']
		liveUrl: { type: String },
		githubUrl: { type: String },
		coverImage: { type: String }, // Cloudinary URL
		featured: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export const Project = model("Project", ProjectSchema);
