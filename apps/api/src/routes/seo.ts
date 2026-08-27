import { Router, Request, Response } from "express";
import { Seo } from "../models/seo.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateSeoSchema } from "../validators/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

// Get SEO Configurations (Public)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    let seo = await Seo.findOne();
    if (!seo) {
      seo = new Seo({
        global: {
          siteTitle: "Omkar Kumar | Senior Frontend Architect & Full Stack Engineer",
          metaDescription: "Senior Software Engineer and Full Stack Architect specializing in premium Next.js applications, high-performance systems, and clean UI/UX design. Delivering world-class digital experiences.",
          siteUrl: "https://omkarkumar.dev",
          defaultOgImage: "",
          robots: "index, follow",
          author: "Omkar Kumar",
          siteName: "Omkar Kumar Portfolio",
          keywords: [
            "Senior Software Engineer",
            "Frontend Architect",
            "Next.js Developer",
            "React Engineer",
            "Full Stack Developer",
            "TypeScript Expert",
          ],
          twitterHandle: "@kumaromkar",
        },
        pages: {
          home: { title: "Home | Omkar Kumar", description: "Welcome to my portfolio website.", robots: "index, follow" },
          about: { title: "About | Omkar Kumar", description: "Learn about my career experience and background.", robots: "index, follow" },
          projects: { title: "Projects | Omkar Kumar", description: "Explore my case studies and software work.", robots: "index, follow" },
          services: { title: "Services | Omkar Kumar", description: "Technical consultancy and full-stack development services.", robots: "index, follow" },
          blog: { title: "Blog | Omkar Kumar", description: "Insights on frontend architecture and next.js developments.", robots: "index, follow" },
          contact: { title: "Contact | Omkar Kumar", description: "Get in touch for custom projects.", robots: "index, follow" },
        },
      });
      await seo.save();
    }
    res.json({ success: true, data: seo });
  })
);

// Update SEO Configuration (Protected)
router.put(
  "/",
  authMiddleware,
  validate(updateSeoSchema),
  asyncHandler(async (req: Request, res: Response) => {
    let seo = await Seo.findOne();
    if (!seo) {
      seo = new Seo(req.body);
    } else {
      Object.assign(seo, req.body);
    }
    await seo.save();
    res.json({ success: true, data: seo });
  })
);

export default router;
