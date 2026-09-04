import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getVerificationHistory, listProducts, updateProduct } from '../controllers/product.controller.js';
import { authorize, requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, listProductsSchema, productIdSchema, updateProductSchema, verificationHistorySchema } from '../validators/product.validator.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.use(requireAuth, authorize('admin', 'manufacturer'));
router.route('/').get(validate(listProductsSchema), asyncHandler(listProducts)).post(validate(createProductSchema), asyncHandler(createProduct));
router.get('/:id/verifications', validate(verificationHistorySchema), asyncHandler(getVerificationHistory));
router.route('/:id').get(validate(productIdSchema), asyncHandler(getProduct)).patch(validate(updateProductSchema), asyncHandler(updateProduct)).delete(validate(productIdSchema), asyncHandler(deleteProduct));
export default router;
