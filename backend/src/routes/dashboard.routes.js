import { Router } from 'express';
import { getDashboardSummary, listSuspiciousProducts } from '../controllers/dashboard.controller.js';
import { authorize, requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { suspiciousProductsSchema } from '../validators/dashboard.validator.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.use(requireAuth, authorize('admin', 'manufacturer'));
router.get('/summary', asyncHandler(getDashboardSummary));
router.get('/suspicious-products', validate(suspiciousProductsSchema), asyncHandler(listSuspiciousProducts));
export default router;
