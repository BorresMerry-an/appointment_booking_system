import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers(req.query as any);
    res.json(result);
  } catch (error) { next(error); }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.json(result);
  } catch (error) { next(error); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.json(result);
  } catch (error) { next(error); }
};

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.toggleUserStatus(req.params.id);
    res.json(result);
  } catch (error) { next(error); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  } catch (error) { next(error); }
};
