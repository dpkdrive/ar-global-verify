import crypto from 'node:crypto';
import Product from '../models/product.model.js';
import ProductCode from '../models/product-code.model.js';
import { notFound } from '../utils/app-error.js';
import { sendSuccess } from '../utils/api-response.js';
import { recordAuditLog } from '../services/audit.service.js';
import { createAuthenticationCode, hashAuthenticationCode } from '../services/product-code.service.js';

export const generateProductCodes = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound('Product');
  if (product.status !== 'active') throw new Error('Codes can only be generated for active products');

  const batchId = crypto.randomUUID();
  const rawCodes = new Set();
  while (rawCodes.size < req.body.quantity) rawCodes.add(createAuthenticationCode());

  await ProductCode.insertMany([...rawCodes].map((code) => ({
    product: product._id,
    codeHash: hashAuthenticationCode(code),
    batchId,
    generatedBy: req.user._id,
  })), { ordered: true });

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
