import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		content: { type: String },
		tags: [String],
		published: { type: Boolean, default: false },
		coverImage: { type: String },
		excerpt: { type: String },
		category: { type: String },
		author: { type: String },
		// i18n fields (Phase 5)
		titleHi: { type: String },
		contentHi: { type: String },
	},
	{ timestamps: true },
);

BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ slug: 1 });

export const Blog = model("Blog", BlogSchema);
