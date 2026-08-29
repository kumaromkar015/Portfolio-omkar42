import { z } from 'zod';

// ── Auth ─────────────────────────────────────────────
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const setupAdminSchema = loginSchema;

// ── Profile ──────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  photo: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().optional(),
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        level: z.number().min(0).max(100),
      })
    )
    .optional(),
  social: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
});

// ── Projects ─────────────────────────────────────────
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ── Blog ─────────────────────────────────────────────
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  titleHi: z.string().optional(),
  contentHi: z.string().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

// ── Experience ───────────────────────────────────────
export const createExperienceSchema = z.object({
  company: z.string().min(1, 'Company/Organization is required'),
  position: z.string().min(1, 'Position/Role/Degree is required'),
  duration: z.string().min(1, 'Duration/Date is required'),
  responsibilities: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  type: z.enum(["work", "education", "project", "goal"]).optional().default("work"),
  displayOrder: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
  imageUrl: z.string().optional().or(z.literal('')),
});

export const updateExperienceSchema = createExperienceSchema.partial();

// ── Education ────────────────────────────────────────
export const createEducationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  year: z.string().min(1, 'Year is required'),
  details: z.string().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

// ── Achievement ──────────────────────────────────────
export const createAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  issuer: z.string().optional(),
  link: z.string().url().optional().or(z.literal('')),
});

export const updateAchievementSchema = createAchievementSchema.partial();

// ── Contact ──────────────────────────────────────────
export const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ── Skills ───────────────────────────────────────────
export const createSkillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(["Frontend", "Backend", "Database", "Languages", "Cloud & DevOps", "Tools & Design"]),
  iconName: z.string().optional().default("Code2"),
  iconUrl: z.string().optional().or(z.literal('')),
  progress: z.number().min(0).max(100).optional().default(80),
  experienceLevel: z.enum(["Expert", "Advanced", "Intermediate"]).optional().default("Advanced"),
  years: z.number().min(0).optional().default(1),
  displayOrder: z.number().optional().default(0),
  featured: z.boolean().optional().default(false),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export const updateSkillSchema = createSkillSchema.partial();

// ── SEO ──────────────────────────────────────────────
export const pageSeoSchema = z.object({
  title: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  canonicalUrl: z.string().optional().or(z.literal('')),
  ogTitle: z.string().optional().or(z.literal('')),
  ogDescription: z.string().optional().or(z.literal('')),
  ogImage: z.string().optional().or(z.literal('')),
  robots: z.string().optional().or(z.literal('')),
});

export const updateSeoSchema = z.object({
  global: z.object({
    siteTitle: z.string().min(1, 'Site Title is required'),
    metaDescription: z.string().optional().or(z.literal('')),
    siteUrl: z.string().optional().or(z.literal('')),
    defaultOgImage: z.string().optional().or(z.literal('')),
    robots: z.string().optional().or(z.literal('')),
    author: z.string().optional().or(z.literal('')),
    siteName: z.string().optional().or(z.literal('')),
    keywords: z.array(z.string()).optional(),
    twitterHandle: z.string().optional().or(z.literal('')),
  }),
  pages: z.object({
    home: pageSeoSchema.optional(),
    about: pageSeoSchema.optional(),
    projects: pageSeoSchema.optional(),
    services: pageSeoSchema.optional(),
    blog: pageSeoSchema.optional(),
    contact: pageSeoSchema.optional(),
  }).optional(),
});

// ── Gallery ──────────────────────────────────────────
export const createGalleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  category: z.enum(["professional", "work", "events", "achievements", "journey"]),
  date: z.string().optional().or(z.literal('')),
  location: z.string().optional(),
  altText: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  displayOrder: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const updateGalleryItemSchema = createGalleryItemSchema.partial();
