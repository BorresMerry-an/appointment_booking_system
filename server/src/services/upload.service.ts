import { supabase } from '../config/supabase';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const BUCKET = process.env.STORAGE_BUCKET || 'appointments';

export class UploadService {
  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<ApiResponse> {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${folder}/${uuidv4()}${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw createError(`Upload failed: ${error.message}`, 500);

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: urlData.publicUrl,
        filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  async deleteFile(filename: string): Promise<ApiResponse> {
    const { error } = await supabase.storage.from(BUCKET).remove([filename]);
    if (error) throw createError(`Delete failed: ${error.message}`, 500);
    return { success: true, message: 'File deleted' };
  }
}
