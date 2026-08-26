import { Schema, model } from "mongoose";

const educationSchema = new Schema(
  {
    school: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
    details: { type: String },
  },
  { timestamps: true }
);

export const Education = model("Education", educationSchema);
