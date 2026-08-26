import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

contactSchema.index({ read: 1, createdAt: -1 });

export const Contact = model('Contact', contactSchema);
