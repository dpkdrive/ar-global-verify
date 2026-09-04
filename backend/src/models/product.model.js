import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // Name is deliberately searchable, not unique: multiple physical products may
  // share a product name while each has its own authentication code.
  name: { type: String, required: true, trim: true, maxlength: 200, index: true },
  sku: { type: String, required: true, trim: true, uppercase: true, maxlength: 80 },
  brand: { type: String, required: true, trim: true, maxlength: 120, index: true },
  description: { type: String, trim: true, maxlength: 5000 },
  category: { type: String, trim: true, maxlength: 100, index: true },
  batchNumber: { type: String, trim: true, maxlength: 100, index: true },
  authenticationCode: { type: String, required: true, unique: true, trim: true, uppercase: true, immutable: true },
  status: { type: String, enum: ['active', 'disabled', 'recalled'], default: 'active', index: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  metadata: { type: Map, of: String, default: {} },
}, { timestamps: true, versionKey: false });

productSchema.index({ owner: 1, sku: 1 }, { unique: true });
productSchema.index({ name: 'text', brand: 'text', sku: 'text' });
export default mongoose.model('Product', productSchema);
