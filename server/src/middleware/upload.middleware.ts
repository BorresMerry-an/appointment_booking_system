import multer from 'multer';
import path from 'path';
import { createError } from './errorHandler';

const storage = multer.memoryStorage(); // Store in memory, then upload to Supabase

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(createError('Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed', 400));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});
