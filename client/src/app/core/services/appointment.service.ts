import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Appointment, AppointmentFilter } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly API = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAll(filter: AppointmentFilter = {}): Observable<ApiResponse<Appointment[]>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params = params.set(key, String(val));
    });
    return this.http.get<ApiResponse<Appointment[]>>(this.API, { params });
  }

  getById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.API}/${id}`);
  }

  create(data: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.API, data);
  }

  update(id: string, data: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(`${this.API}/${id}`, data);
  }

  updateStatus(id: string, status: string, admin_notes?: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.API}/${id}/status`, { status, admin_notes });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API}/${id}`);
  }

  getStats(): Observable<ApiResponse<Record<string, number>>> {
    return this.http.get<ApiResponse<Record<string, number>>>(`${this.API}/stats`);
  }
}
