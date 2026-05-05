import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, toggleUserStatus, deleteUser } from '../controllers/user.controller';
import { authenticate, authorizeAdmin, authorizeOwnerOrAdmin } from '../middleware/auth.middleware';
import { paginationValidator } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of users }
 */
router.get('/', authorizeAdmin, paginationValidator, handleValidation, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: User data }
 *       404: { description: User not found }
 */
router.get('/:id', authorizeOwnerOrAdmin('id'), getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone: { type: string }
 *               avatar_url: { type: string }
 *     responses:
 *       200: { description: Updated user }
 */
router.put('/:id', authorizeOwnerOrAdmin('id'), updateUser);

/**
 * @swagger
 * /users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Status toggled }
 */
router.patch('/:id/toggle-status', authorizeAdmin, toggleUserStatus);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User deleted }
 */
router.delete('/:id', authorizeAdmin, deleteUser);

export default router;
