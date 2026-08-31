import { Schema, model } from "mongoose";

const PageSeoSchema = new Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  canonicalUrl: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  ogImage: { type: String, default: "" },
  robots: { type: String, default: "index, follow" },
});

const SeoSchema = new Schema(
  {
    global: {
      siteTitle: { type: String, required: true, default: "Omkar Kumar | Senior Frontend Architect & Full Stack Engineer" },
      metaDescription: { type: String, default: "Senior Software Engineer and Full Stack Architect specializing in premium Next.js applications, high-performance systems, and clean UI/UX design." },
      siteUrl: { type: String, default: "https://omkarkumar.dev" },
      defaultOgImage: { type: String, default: "" },
      robots: { type: String, default: "index, follow" },
      author: { type: String, default: "Omkar Kumar" },
      siteName: { type: String, default: "Omkar Kumar Portfolio" },
      keywords: [{ type: String }],
      twitterHandle: { type: String, default: "@kumaromkar" },
      enableEasterEgg: { type: Boolean, default: true },
    },
    pages: {
      home: { type: PageSeoSchema, default: () => ({}) },
      about: { type: PageSeoSchema, default: () => ({}) },
      projects: { type: PageSeoSchema, default: () => ({}) },
      services: { type: PageSeoSchema, default: () => ({}) },
      blog: { type: PageSeoSchema, default: () => ({}) },
      contact: { type: PageSeoSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

export const Seo = model("Seo", SeoSchema);
