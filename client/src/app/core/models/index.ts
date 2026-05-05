export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  file_url?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  user?: Partial<User>;
}

export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AppointmentFilter {
  page?: number;
  limit?: number;
  status?: AppointmentStatus | '';
  date?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
