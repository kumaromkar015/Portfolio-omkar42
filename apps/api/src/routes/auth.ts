import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, setupAdminSchema } from "../validators/index.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

const router = Router();

// Rate limit login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login Admin
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new AppError("Invalid username or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid username or password", 401);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({ success: true, data: { token, username: user.username } });
  })
);

// Setup Initial Admin (Create admin if not exists)
router.post(
  "/setup",
  validate(setupAdminSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ role: "admin" });
    if (existingUser) {
      throw new AppError("Admin user already configured", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    res.status(201).json({ success: true, message: "Admin setup completed successfully" });
  })
);

export default router;
