import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { registerValidator, loginValidator } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *               full_name: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: User registered }
 *       409: { description: Email already exists }
 *       422: { description: Validation error }
 */
router.post('/register', registerValidator, handleValidation, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns JWT token }
 *       401: { description: Invalid credentials }
 */
router.post('/login', loginValidator, handleValidation, login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     responses:
 *       200: { description: Current user data }
 *       401: { description: Unauthorized }
 */
router.get('/me', authenticate, getMe);

export default router;
