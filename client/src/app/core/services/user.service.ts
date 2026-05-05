import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAll(params: Record<string, string | number> = {}): Observable<ApiResponse<User[]>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => httpParams = httpParams.set(k, String(v)));
    return this.http.get<ApiResponse<User[]>>(this.API, { params: httpParams });
  }

  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API}/${id}`);
  }

  update(id: string, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API}/${id}`, data);
  }

  toggleStatus(id: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.API}/${id}/toggle-status`, {});
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${id}`);
  }
}
