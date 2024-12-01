import { z } from 'zod';

/**
 * @constant baseSchema
 * @description Common validation rules shared across task schemas (create and update).
 */
const baseSchema = {
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
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
};

/**
 * @constant createTaskSchema
 * @description Schema for validating task creation.
 * - Inherits common rules from `baseSchema`.
 * - Adds `status` with validation for "TODO" or "DONE" and a default value of "TODO".
 */
export const createTaskSchema = z.object({
  ...baseSchema,
  status: z
    .enum(['TODO', 'DONE'], {
      message: 'Status must be either "TODO" or "DONE"',
    })
    .default('TODO'),
});

/**
 * @constant updateTaskSchema
 * @description Schema for validating task updates.
 * - Inherits common rules from `baseSchema`.
 */
export const updateTaskSchema = z.object(baseSchema);
