import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../utils/apperror";
import { z } from "zod";



export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  

  console.error(`Custom middleware: ${err}`);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: err.message,
      errors: err.details,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Server Error',
  });
};

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


  next();
};

