import { z } from 'zod';
import { tagQuerySchema } from '@quanta/web/lib/tags';

export const searchQuerySchema = z.object({
  query: z.string().optional(),
  tags: z.array(tagQuerySchema).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
