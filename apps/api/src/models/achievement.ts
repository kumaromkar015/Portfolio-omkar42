import { Schema, model } from "mongoose";

const achievementSchema = new Schema(
	{
		title: { type: String, required: true },
		type: { type: String }, // 'hackathon' | 'cert' | 'award'
		date: { type: String },
		description: { type: String },
	},
	{ timestamps: true },
);
