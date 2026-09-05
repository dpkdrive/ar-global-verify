import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { AppError } from '../utils/app-error.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, '../../uploads/products');
const extensionByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}${extensionByMimeType[file.mimetype]}`),
});

const fileFilter = (req, file, callback) => {
  if (!extensionByMimeType[file.mimetype]) {
    return callback(new AppError('Product image must be a JPEG, PNG, or WebP file', 422, 'INVALID_IMAGE_TYPE'));
  }
  return callback(null, true);
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('image');
