import { z } from 'zod';
import { objectId, paginationQuery } from './common.validator.js';

export const listAuditLogsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: paginationQuery.extend({
    action: z.enum(['product.created', 'product.updated', 'product.deleted', 'user.created', 'user.updated', 'user.deactivated', 'auth.password_changed']).optional(),
    targetId: objectId.optional(),
  }),
});
