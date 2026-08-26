import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/** Creates middleware that validates req.body against the provided Zod schema */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.map(String).join('.'),
        message: issue.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
