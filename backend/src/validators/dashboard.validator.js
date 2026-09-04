import { z } from 'zod';
import { paginationQuery } from './common.validator.js';

export const suspiciousProductsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: paginationQuery,
});
