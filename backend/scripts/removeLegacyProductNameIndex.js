import dotenv from 'dotenv';
import mongoose from 'mongoose';
import env from '../src/config/env.js';
import Product from '../src/models/product.model.js';

dotenv.config();

/**
 * Older deployments may have a unique `{ name: 1 }` product index.
 * The current model intentionally permits duplicate names; identity is the
 * authentication code. This removes only that exact legacy unique index.
 */
try {
  await mongoose.connect(env.MONGODB_URI);
  const indexes = await Product.collection.indexes();
  const legacyNameIndexes = indexes.filter((index) => index.unique && Object.keys(index.key).length === 1 && index.key.name === 1);

  if (!legacyNameIndexes.length) {
    console.log('No legacy unique product-name index found. No changes made.');
  } else {
    for (const index of legacyNameIndexes) {
      await Product.collection.dropIndex(index.name);
      console.log(`Removed legacy index: ${index.name}`);
    }
  }
} finally {
  await mongoose.disconnect();
}
