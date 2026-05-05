import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { createError } from '../middleware/errorHandler';

const uploadService = new UploadService();

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw createError('No file provided', 400);
    const folder = req.query.folder as string || 'uploads';
    const result = await uploadService.uploadFile(req.file, folder);
    res.status(201).json(result);
  } catch (error) { next(error); }
};
