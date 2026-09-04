import { z } from 'zod';
export const verifySchema = z.object({ body: z.object({ code: z.string().trim().min(6).max(128).regex(/^[A-Za-z0-9_-]+$/) }).strict(), params: z.object({}), query: z.object({}) });
