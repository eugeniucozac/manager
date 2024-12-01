import { z } from 'zod';

/**
 * @function validateSchema
 * @description Middleware function for validating incoming request bodies against a given Zod schema.
 * @param {z.ZodSchema} schema - The Zod schema to validate the request body against.
 * @returns {Function} - An Express middleware function.
 */
export const validateSchema =
  (schema: z.ZodSchema) => (req: Request, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(', ') });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
