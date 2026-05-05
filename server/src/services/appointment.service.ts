import { supabase } from '../config/supabase';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginationQuery } from '../types';

interface CreateAppointmentDTO {
  user_id: string;
  title: string;
  description?: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  file_url?: string;
}

export class AppointmentService {
  async create(dto: CreateAppointmentDTO): Promise<ApiResponse> {
    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...dto, status: 'pending' })
      .select('*, user:users(id, full_name, email)')
      .single();

    if (error) throw createError(error.message, 500);
    return { success: true, message: 'Appointment created successfully', data };
  }

  async getAll(query: PaginationQuery, userId?: string, isAdmin = false): Promise<ApiResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    let dbQuery = supabase
      .from('appointments')
      .select('*, user:users(id, full_name, email, phone)', { count: 'exact' });

    // Non-admins only see their own appointments
    if (!isAdmin && userId) {
      dbQuery = dbQuery.eq('user_id', userId);
    }

    if (query.status) dbQuery = dbQuery.eq('status', query.status);
    if (query.date) dbQuery = dbQuery.eq('appointment_date', query.date);
    if (query.search) {
      dbQuery = dbQuery.ilike('title', `%${query.search}%`);
    }

    dbQuery = dbQuery
      .order(query.sort || 'created_at', { ascending: query.order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;
    if (error) throw createError(error.message, 500);

    return {
      success: true,
      message: 'Appointments fetched',
      data,
      meta: { total: count || 0, page, limit, totalPages: Math.ceil((count || 0) / limit) },
    };
  }

  async getById(id: string, userId?: string, isAdmin = false): Promise<ApiResponse> {
    let dbQuery = supabase
      .from('appointments')
      .select('*, user:users(id, full_name, email, phone)')
      .eq('id', id);

    if (!isAdmin && userId) {
      dbQuery = dbQuery.eq('user_id', userId);
    }

    const { data, error } = await dbQuery.single();
    if (error || !data) throw createError('Appointment not found', 404);
    return { success: true, message: 'Appointment fetched', data };
  }

  async update(id: string, userId: string, isAdmin: boolean, updates: Partial<CreateAppointmentDTO>): Promise<ApiResponse> {
    // Ownership check for non-admins
    if (!isAdmin) {
      const { data: appt } = await supabase
        .from('appointments')
        .select('user_id, status')
        .eq('id', id)
        .single();
      if (!appt) throw createError('Appointment not found', 404);
      if (appt.user_id !== userId) throw createError('Forbidden', 403);
      if (appt.status !== 'pending') throw createError('Only pending appointments can be edited', 400);
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, user:users(id, full_name, email)')
      .single();

    if (error) throw createError(error.message, 500);
    return { success: true, message: 'Appointment updated', data };
  }

  async updateStatus(id: string, status: string, admin_notes?: string): Promise<ApiResponse> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, admin_notes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, user:users(id, full_name, email)')
      .single();

    if (error) throw createError(error.message, 500);
    return { success: true, message: `Appointment ${status}`, data };
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<ApiResponse> {
    if (!isAdmin) {
      const { data: appt } = await supabase
        .from('appointments')
        .select('user_id')
        .eq('id', id)
        .single();
      if (!appt || appt.user_id !== userId) throw createError('Forbidden', 403);
    }

    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw createError(error.message, 500);
    return { success: true, message: 'Appointment deleted' };
  }

  async getStats(): Promise<ApiResponse> {
    const { data, error } = await supabase
      .from('appointments')
      .select('status');

    if (error) throw createError(error.message, 500);

    const stats = {
      total: data.length,
      pending: data.filter((a) => a.status === 'pending').length,
      approved: data.filter((a) => a.status === 'approved').length,
      rejected: data.filter((a) => a.status === 'rejected').length,
      cancelled: data.filter((a) => a.status === 'cancelled').length,
    };

    return { success: true, message: 'Stats fetched', data: stats };
  }
}
