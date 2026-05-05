import { supabase } from '../config/supabase';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, PaginationQuery } from '../types';

export class UserService {
  async getAllUsers(query: PaginationQuery): Promise<ApiResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    let dbQuery = supabase
      .from('users')
      .select('id, email, full_name, phone, role, is_active, avatar_url, created_at', { count: 'exact' });

    if (query.search) {
      dbQuery = dbQuery.or(`full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
    }

    dbQuery = dbQuery
      .order(query.sort || 'created_at', { ascending: query.order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;
    if (error) throw createError(error.message, 500);

    return {
      success: true,
      message: 'Users fetched',
      data,
      meta: { total: count || 0, page, limit, totalPages: Math.ceil((count || 0) / limit) },
    };
  }

  async getUserById(id: string): Promise<ApiResponse> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, is_active, avatar_url, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) throw createError('User not found', 404);
    return { success: true, message: 'User fetched', data };
  }

  async updateUser(id: string, updates: Partial<{ full_name: string; phone: string; avatar_url: string }>): Promise<ApiResponse> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, full_name, phone, role, avatar_url, is_active, updated_at')
      .single();

    if (error) throw createError(error.message, 500);
    return { success: true, message: 'Profile updated', data };
  }

  async toggleUserStatus(id: string): Promise<ApiResponse> {
    const { data: user } = await supabase.from('users').select('is_active').eq('id', id).single();
    if (!user) throw createError('User not found', 404);

    const { data, error } = await supabase
      .from('users')
      .update({ is_active: !user.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, is_active')
      .single();

    if (error) throw createError(error.message, 500);
    return { success: true, message: `User ${data.is_active ? 'activated' : 'deactivated'}`, data };
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw createError(error.message, 500);
    return { success: true, message: 'User deleted' };
  }
}
