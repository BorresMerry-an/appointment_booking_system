import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthState, LoginPayload, RegisterPayload, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'appt_token';
  private readonly USER_KEY = 'appt_user';

  // Signals for reactive state
  currentUser = signal<User | null>(this.getStoredUser());
  isLoading = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<ApiResponse<{ user: User; token: string }>> {
    this.isLoading.set(true);
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.API}/register`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) this.setSession(res.data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  login(payload: LoginPayload): Observable<ApiResponse<{ user: User; token: string }>> {
    this.isLoading.set(true);
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.API}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) this.setSession(res.data);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  getMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API}/me`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(data: { user: User; token: string }): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }
}
