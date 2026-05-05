import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase';
import { generateToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';
import { User, ApiResponse } from '../types';

interface RegisterDTO {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(dto: RegisterDTO): Promise<ApiResponse> {
    // Check existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .single();

    if (existing) throw createError('Email already registered', 409);

    // Hash password
    const password_hash = await bcrypt.hash(dto.password, 12);

    // Insert user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: dto.email,
        password_hash,
        full_name: dto.full_name,
        phone: dto.phone || null,
        role: 'user',
        is_active: true,
      })
      .select('id, email, full_name, phone, role, created_at')
      .single();

    if (error) throw createError(`Registration failed: ${error.message}`, 500);

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return {
      success: true,
      message: 'Registration successful',
      data: { user, token },
    };
  }

  async login(dto: LoginDTO): Promise<ApiResponse> {
    // Fetch user with password hash
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, password_hash, is_active, avatar_url')
      .eq('email', dto.email)
      .single();

    if (error || !user) throw createError('Invalid email or password', 401);
    if (!user.is_active) throw createError('Account is deactivated. Contact admin.', 403);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) throw createError('Invalid email or password', 401);

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const { password_hash: _, ...safeUser } = user;

    return {
      success: true,
      message: 'Login successful',
      data: { user: safeUser, token },
    };
  }

  async getMe(userId: string): Promise<ApiResponse> {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, role, avatar_url, is_active, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) throw createError('User not found', 404);

    return { success: true, message: 'User fetched', data: user };
  }
}
