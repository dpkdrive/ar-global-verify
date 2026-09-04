import { z } from 'zod';
import { objectId, paginationQuery } from './common.validator.js';
const productFields = {
  name: z.string().trim().min(1).max(200), sku: z.string().trim().min(1).max(80), brand: z.string().trim().min(1).max(120),
  description: z.string().trim().max(5000).optional(), category: z.string().trim().max(100).optional(), batchNumber: z.string().trim().max(100).optional(),
  authenticationCode: z.string().trim().min(6).max(128).regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores are allowed'),
  status: z.enum(['active', 'disabled', 'recalled']).optional(), metadata: z.record(z.string().max(200)).optional(), owner: objectId.optional(),
};
export const createProductSchema = z.object({ body: z.object(productFields).strict(), params: z.object({}), query: z.object({}) });
export const updateProductSchema = z.object({ body: z.object(productFields).omit({ authenticationCode: true }).partial().strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required'), params: z.object({ id: objectId }), query: z.object({}) });
export const productIdSchema = z.object({ body: z.object({}), params: z.object({ id: objectId }), query: z.object({}) });
export const verificationHistorySchema = z.object({
  body: z.object({}),
  params: z.object({ id: objectId }),
  query: paginationQuery,
});
export const listProductsSchema = z.object({ body: z.object({}), params: z.object({}), query: paginationQuery.extend({ status: z.enum(['active', 'disabled', 'recalled']).optional(), search: z.string().trim().max(100).optional() }) });
