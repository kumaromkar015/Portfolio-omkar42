import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  organization: string;
  quote: string;
  photoUrl?: string;
  profileUrl?: string;
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
  relationship?: string;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    organization: { type: String, required: true },
    quote: { type: String, required: true },
    photoUrl: { type: String },
    profileUrl: { type: String },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    relationship: { type: String, default: "Professional collaborator" },
  },
  { timestamps: true }
);

testimonialSchema.index({ displayOrder: 1 });
testimonialSchema.index({ isVisible: 1 });

export const Testimonial = model<ITestimonial>("Testimonial", testimonialSchema);
