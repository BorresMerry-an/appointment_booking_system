import { body, param, query } from 'express-validator';

// ─── Auth Validators ────────────────────────────────────
export const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be 2-100 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Appointment Validators ─────────────────────────────
export const createAppointmentValidator = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('appointment_date').isDate().withMessage('Valid date (YYYY-MM-DD) is required'),
  body('appointment_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid time (HH:MM) is required'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('notes').optional().trim().isLength({ max: 500 }),
];

export const updateAppointmentValidator = [
  body('title').optional().trim().isLength({ min: 3, max: 200 }),
  body('appointment_date').optional().isDate(),
  body('appointment_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('notes').optional().trim().isLength({ max: 500 }),
];

export const statusUpdateValidator = [
  body('status')
    .isIn(['approved', 'rejected', 'cancelled'])
    .withMessage('Status must be: approved, rejected, or cancelled'),
  body('admin_notes').optional().trim().isLength({ max: 500 }),
];

// ─── UUID Param Validator ───────────────────────────────
export const uuidParamValidator = (paramName: string) => [
  param(paramName).isUUID().withMessage(`${paramName} must be a valid UUID`),
];

// ─── Pagination Query Validator ─────────────────────────
export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'cancelled']),
  query('sort').optional().isIn(['created_at', 'appointment_date', 'title', 'status']),
  query('order').optional().isIn(['asc', 'desc']),
];
