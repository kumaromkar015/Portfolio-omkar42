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
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  duration: z.string().min(1, 'Duration is required'),
  responsibilities: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
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
