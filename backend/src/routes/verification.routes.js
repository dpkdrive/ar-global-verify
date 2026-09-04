import { Router } from 'express';
import { verifyProduct } from '../controllers/verification.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifySchema } from '../validators/verification.validator.js';
import { asyncHandler } from '../utils/async-handler.js';
const router = Router();
router.post('/', validate(verifySchema), asyncHandler(verifyProduct));
export default router;
