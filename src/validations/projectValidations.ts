import { z } from 'zod';

/**
 * @constant createUpdateProjectSchema
 * @description Schema for validating and transforming project data for both creation and update operations.
 * Ensures the input data conforms to the expected structure and rules.
 */
export const createUpdateProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  description: z.string().optional(),
  startDate: z
    .string()
    .transform((date) => new Date(date))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid start date. Must be a valid date.',
    }),
  endDate: z
    .string()
    .transform((date) => new Date(date))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid end date. Must be a valid date.',
    }),
});
