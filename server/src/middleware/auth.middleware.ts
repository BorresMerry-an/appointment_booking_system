import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiResponse } from '../types';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(<ApiResponse>{
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json(<ApiResponse>{
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json(<ApiResponse>{
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
    return;
  }
  next();
};

export const authorizeOwnerOrAdmin = (userIdParam: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const targetUserId = req.params[userIdParam];
    if (req.user?.role === 'admin' || req.user?.userId === targetUserId) {
      next();
      return;
    }
    res.status(403).json(<ApiResponse>{
      success: false,
      message: 'Access denied. You can only access your own resources.',
    });
  };
