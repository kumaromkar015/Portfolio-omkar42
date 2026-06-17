import { timeStamp } from "console";
import { model, Schema } from "mongoose";

const profileSchema = new Schema(
	{
		name: { type: String, required: true },
		bio: { type: String },
		photo: { type: String },
		resumeUrl: { type: String },
		skills: [
			{
				name: { type: String },
				level: { type: Number, min: 0, max: 100 },
			},
		],
		social: {
			github: String,
			linkedin: String,
			twitter: String,
		},
	},
	{ timestamps: true },
);

export const Profile = model('Profile' , profileSchema);
