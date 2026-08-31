import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, sparse: true },
		description: { type: String },
		longDescription: { type: String },
		techStack: [String],
		liveUrl: { type: String },
		githubUrl: { type: String },
		coverImage: { type: String },
		gallery: [String],
		featured: { type: Boolean, default: false },
		category: { type: String },
		tags: [String],
		// Case Study Details
		problem: { type: String },
		solution: { type: String },
		role: { type: String },
		challenges: { type: String },
		results: { type: String },
		architecture: { type: String },
		features: [String],
		// SEO Metadata
		metaTitle: { type: String },
		metaDescription: { type: String },
		metaKeywords: { type: String },
	},
	{ timestamps: true },
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });

export const Project = model("Project", ProjectSchema);
