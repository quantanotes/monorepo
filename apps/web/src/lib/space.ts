import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Must be at least 3 characters long' })
    .max(24, { message: 'Must be at most 24 characters long' })
    .refine((value) => /^[a-zA-Z]/.test(value), {
      message: 'Must begin with a letter',
    })
    .refine((value) => /^[a-zA-Z0-9-]*$/.test(value), {
      message: 'Must only contain alphanumeric characters and hyphens',
    }),
});
