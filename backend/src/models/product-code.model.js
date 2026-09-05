import mongoose from 'mongoose';

const productCodeSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  // Raw codes are intentionally never stored. This hash supports verification
  // while limiting the impact of a database disclosure.
  codeHash: { type: String, required: true, unique: true, immutable: true },
  batchId: { type: String, required: true, index: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active', index: true },
  verifiedAt: { type: Date },
}, { timestamps: true, versionKey: false });

productCodeSchema.index({ product: 1, createdAt: -1 });
productCodeSchema.index({ product: 1, status: 1 });

export default mongoose.model('ProductCode', productCodeSchema);
