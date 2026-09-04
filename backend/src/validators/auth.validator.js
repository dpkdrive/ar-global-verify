import { z } from 'zod';
// Password-strength requirements belong to account creation/reset flows. Login
// accepts any non-empty password so previously issued credentials can authenticate.
export const loginSchema = z.object({ body: z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) }), params: z.object({}), query: z.object({}) });

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(12).max(128),
  }).strict().refine((value) => value.currentPassword !== value.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }),
  params: z.object({}),
  query: z.object({}),
});
