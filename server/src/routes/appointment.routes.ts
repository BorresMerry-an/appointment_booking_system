import { Router } from 'express';
import {
  createAppointment, getAppointments, getAppointmentById,
  updateAppointment, updateAppointmentStatus, deleteAppointment, getStats
} from '../controllers/appointment.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import {
  createAppointmentValidator, updateAppointmentValidator,
  statusUpdateValidator, paginationValidator
} from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /appointments/stats:
 *   get:
 *     summary: Get appointment statistics (Admin only)
 *     tags: [Appointments]
 *     responses:
 *       200: { description: Stats object }
 */
router.get('/stats', authorizeAdmin, getStats);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get appointments (own for users, all for admins)
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected, cancelled] }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of appointments with pagination }
 */
router.get('/', paginationValidator, handleValidation, getAppointments);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, appointment_date, appointment_time]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               appointment_date: { type: string, format: date }
 *               appointment_time: { type: string, example: '14:30' }
 *               notes: { type: string }
 *               file_url: { type: string }
 *     responses:
 *       201: { description: Appointment created }
 */
router.post('/', createAppointmentValidator, handleValidation, createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Appointment data }
 *       404: { description: Not found }
 */
router.get('/:id', getAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update appointment (owner or admin, pending only)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200: { description: Updated appointment }
 */
router.put('/:id', updateAppointmentValidator, handleValidation, updateAppointment);

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Update appointment status (Admin only)
 *     tags: [Appointments]
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [approved, rejected, cancelled] }
 *               admin_notes: { type: string }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch('/:id/status', authorizeAdmin, statusUpdateValidator, handleValidation, updateAppointmentStatus);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Appointment deleted }
 */
router.delete('/:id', deleteAppointment);

export default router;
