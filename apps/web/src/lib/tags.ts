import { z } from 'zod';

export const tagQuerySchema = z.object({
  tag: z.string(),
  operator: z.string().optional(),
  value: z.string().optional(),
});

export function validateTagValue(value: any, tag: any) {
  switch (tag.type) {
    case 'text':
      value = typeof value === 'string' ? value : tag.default;
      break;
    case 'number':
      value = typeof value === 'number' ? value : tag.default;
      if (isNaN(value)) value = 0;
      break;
    case 'boolean':
      value = typeof value === 'boolean' ? value : tag.default;
      break;
    default:
      if (tag.default) {
        value = tag.default;
      }
  }
  return value;
}
