import { Router } from 'express';
import { listAuditLogs } from '../controllers/audit-log.controller.js';
import { authorize, requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { listAuditLogsSchema } from '../validators/audit-log.validator.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.get('/', requireAuth, authorize('admin', 'manufacturer'), validate(listAuditLogsSchema), asyncHandler(listAuditLogs));
export default router;
