import { Router, Request, Response } from "express";
import { Profile } from "../models/profile.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema } from "../validators/index.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router();

// Get Profile Info
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({
        name: "Omkar Kumar",
        bio: "Senior Frontend Architect & Full Stack Developer",
        photo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        resumeUrl: "/resume.pdf",
        skills: [],
        social: {
          github: "https://github.com/kumaromkar015",
          linkedin: "https://linkedin.com/in/kumaromkar015",
          twitter: "https://twitter.com/kumaromkar",
        },
      });
      await profile.save();
    }
    res.json({ success: true, data: profile });
  })
);

// Update Profile Info (Protected)
router.put(
  "/",
  authMiddleware,
  validate(updateProfileSchema),
  asyncHandler(async (req: Request, res: Response) => {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json({ success: true, data: profile });
  })
);

export default router;
