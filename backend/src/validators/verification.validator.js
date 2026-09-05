import { z } from 'zod';

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .email()
  .or(z.literal(''))
  .optional()
  .transform((value) => value || undefined);

const optionalMobile = z
  .string()
  .trim()
  .max(30)
  .or(z.literal(''))
  .optional()
  .transform((value) => value || undefined);

export const verifySchema = z.object({
  body: z.object({
    code: z.string().trim().min(6).max(128).regex(/^[A-Za-z0-9_-]+$/),
    email: optionalEmail,
    mobile: optionalMobile,
  }).strict(),
  params: z.object({}),
  query: z.object({}),
});
