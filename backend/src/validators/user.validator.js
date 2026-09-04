import { z } from 'zod';
import { objectId, paginationQuery } from './common.validator.js';
const fields = { name: z.string().trim().min(2).max(100), email: z.string().email().max(254), password: z.string().min(12).max(128), role: z.enum(['admin', 'manufacturer']).optional(), companyName: z.string().trim().max(150).optional(), isActive: z.boolean().optional() };
export const createUserSchema = z.object({ body: z.object(fields).strict(), params: z.object({}), query: z.object({}) });
export const listUsersSchema = z.object({ body: z.object({}), params: z.object({}), query: paginationQuery.extend({ role: z.enum(['admin', 'manufacturer']).optional() }) });
export const userIdSchema = z.object({ body: z.object({}), params: z.object({ id: objectId }), query: z.object({}) });
export const updateUserSchema = z.object({ body: z.object(fields).omit({ password: true }).partial().strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required'), params: z.object({ id: objectId }), query: z.object({}) });
