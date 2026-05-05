import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';

const appointmentService = new AppointmentService();

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await appointmentService.create({ ...req.body, user_id: req.user!.userId });
    res.status(201).json(result);
  } catch (error) { next(error); }
};

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const result = await appointmentService.getAll(req.query as any, req.user!.userId, isAdmin);
    res.json(result);
  } catch (error) { next(error); }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const result = await appointmentService.getById(req.params.id, req.user!.userId, isAdmin);
    res.json(result);
  } catch (error) { next(error); }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const result = await appointmentService.update(req.params.id, req.user!.userId, isAdmin, req.body);
    res.json(result);
  } catch (error) { next(error); }
};

export const updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, admin_notes } = req.body;
    const result = await appointmentService.updateStatus(req.params.id, status, admin_notes);
    res.json(result);
  } catch (error) { next(error); }
};

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user!.role === 'admin';
    const result = await appointmentService.delete(req.params.id, req.user!.userId, isAdmin);
    res.json(result);
  } catch (error) { next(error); }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await appointmentService.getStats();
    res.json(result);
  } catch (error) { next(error); }
};
