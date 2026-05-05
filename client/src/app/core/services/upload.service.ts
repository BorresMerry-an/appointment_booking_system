import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly API = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder = 'appointments'): Observable<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ url: string; filename: string }>>(`${this.API}?folder=${folder}`, formData);
  }
}
