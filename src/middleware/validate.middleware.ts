import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/apperror';

export const validate = (schema: z.ZodObject<any>) => (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const validation = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!validation.success) {
    next(new ValidationError('Validation failed', validation.error.issues));
    return;
  }

  if (validation.data.body !== undefined) {
    req.body = validation.data.body;
  }

  if (validation.data.params !== undefined) {
    req.params = validation.data.params;
  }

  if (validation.data.query !== undefined) {
    req.query = validation.data.query;
  }

  next();
};
