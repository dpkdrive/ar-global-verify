import crypto from 'node:crypto';
import Product from '../models/product.model.js';
import ProductCode from '../models/product-code.model.js';
import { AppError, notFound } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { recordAuditLog } from '../services/audit.service.js';
import { createAuthenticationCode, hashAuthenticationCode } from '../services/product-code.service.js';

export const generateProductCodes = async (req, res) => {
  // Manufacturers can only generate codes for products they own. Admins can
  // generate codes for any product in the catalog.
  const product = await Product.findOne({
    _id: req.params.id,
    ...(req.user.role === 'admin' ? {} : { owner: req.user.id }),
  });
  if (!product) throw notFound('Product');
  if (product.status !== 'active') {
    throw new AppError('Codes can only be generated for an active product', 422, 'INVALID_PRODUCT_STATUS');
  }

  const batchId = crypto.randomUUID();
  const rawCodes = new Set();
  while (rawCodes.size < req.body.quantity) rawCodes.add(createAuthenticationCode());

  try {
    await ProductCode.insertMany([...rawCodes].map((code) => ({
      product: product._id,
      codeHash: hashAuthenticationCode(code),
      batchId,
      generatedBy: req.user._id,
    })), { ordered: true });
  } catch (error) {
    // A cryptographic collision is exceptionally unlikely. Do not claim a
    // partial batch succeeded; the caller can safely retry the request.
    if (error?.code === 11000) {
      throw new AppError('A code collision occurred. Please generate the batch again.', 409, 'CODE_COLLISION');
    }
    throw error;
  }

  await recordAuditLog({
    req,
    action: 'product.codes_generated',
    targetType: 'product',
    targetId: product.id,
    details: { batchId, quantity: rawCodes.size },
  });

  return sendSuccess(res, {
    status: 201,
    message: `${rawCodes.size} verification codes generated`,
    data: { product: { id: product.id, name: product.name, sku: product.sku }, batchId, codes: [...rawCodes] },
  });
};
