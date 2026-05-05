export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  file_url?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  user?: Partial<User>;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
