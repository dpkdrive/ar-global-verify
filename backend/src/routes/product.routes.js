import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, getVerificationHistory, listProducts, listPublicProducts, updateProduct } from '../controllers/product.controller.js';
import { authorize, requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, listProductsSchema, productIdSchema, updateProductSchema, verificationHistorySchema } from '../validators/product.validator.js';
import { asyncHandler } from '../utils/async-handler.js';
import { uploadProductImage } from '../middlewares/product-image-upload.middleware.js';
import { generateProductCodes } from '../controllers/product-code.controller.js';
import { generateProductCodesSchema } from '../validators/product-code.validator.js';

const router = Router();
router.get('/public', asyncHandler(listPublicProducts));
router.use(requireAuth, authorize('admin', 'manufacturer'));
router.route('/').get(validate(listProductsSchema), asyncHandler(listProducts)).post(uploadProductImage, validate(createProductSchema), asyncHandler(createProduct));
router.post('/:id/codes', authorize('admin', 'manufacturer'), validate(generateProductCodesSchema), asyncHandler(generateProductCodes));
router.get('/:id/verifications', validate(verificationHistorySchema), asyncHandler(getVerificationHistory));
router.route('/:id').get(validate(productIdSchema), asyncHandler(getProduct)).patch(validate(updateProductSchema), asyncHandler(updateProduct)).delete(validate(productIdSchema), asyncHandler(deleteProduct));
export default router;
