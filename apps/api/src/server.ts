// Load environment variables BEFORE anything else
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import projectRoutes from "./routes/projects.js";
import blogRoutes from "./routes/blog.js";
import experienceRoutes from "./routes/experience.js";
import educationRoutes from "./routes/education.js";
import achievementRoutes from "./routes/achievement.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
import mediaRoutes from "./routes/media.js";
import skillsRoutes from "./routes/skills.js";
import seoRoutes from "./routes/seo.js";
import galleryRoutes from "./routes/gallery.js";
import githubRoutes from "./routes/github.js";
import changelogRoutes from "./routes/changelog.js";
import testimonialRoutes from "./routes/testimonials.js";
import assistantRoutes from "./routes/assistant.js";

// Validate critical environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// Body parsing — increase limit for base64 image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
await connectDB();

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/changelog", changelogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/assistant", assistantRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio-OMKAR API Running",
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handler — MUST be registered LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS origins: ${allowedOrigins.join(", ")}`);
});
