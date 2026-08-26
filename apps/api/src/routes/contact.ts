import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { Contact } from '../models/contact.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createContactSchema } from '../validators/index.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = Router();

// Rate limit contact form: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many contact requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Submit Contact Form (Public, rate-limited)
router.post(
  '/',
  contactLimiter,
  validate(createContactSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({
      success: true,
      message: 'Message sent successfully. I will get back to you soon!',
    });
  })
);

// Get All Messages (Protected)
router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  })
);

// Mark Message as Read (Protected)
router.patch(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      throw new AppError('Message not found', 404);
    }
    res.json({ success: true, data: message });
  })
);

// Delete Message (Protected)
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      throw new AppError('Message not found', 404);
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  })
);

export default router;
