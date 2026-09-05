import { z } from 'zod';
import { objectId } from './common.validator.js';

export const generateProductCodesSchema = z.object({
  body: z.object({ quantity: z.coerce.number().int().min(1).max(500) }).strict(),
  params: z.object({ id: objectId }),
  query: z.object({}),
});
