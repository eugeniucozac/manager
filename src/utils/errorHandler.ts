import { Request, Response, NextFunction } from 'express';

/**
 * @function errorHandler
 * @description Centralized error handling middleware for the application.
 * This middleware captures errors, processes them, and sends an appropriate response.
 *
 * @param {any} err - The error object passed from other middleware or controllers.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function (used for chaining).
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === 'ZodError') {
    return res
      .status(400)
      .json({ message: err.errors.map((e: any) => e.message).join(', ') });
  }
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
