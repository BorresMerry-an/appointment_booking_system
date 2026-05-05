import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file (image or document) to Supabase Storage
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional subfolder name
 *     responses:
 *       201:
 *         description: File uploaded, returns public URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url: { type: string }
 *                     filename: { type: string }
 *       400:
 *         description: No file or invalid type
 */
router.post('/', upload.single('file'), uploadFile);

export default router;
