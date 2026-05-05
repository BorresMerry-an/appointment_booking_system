import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentFilter, PaginationMeta } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-bold text-white">Appointments</h1>
            <p class="text-slate-400 mt-1">{{ meta()?.total || 0 }} total appointments</p>
          </div>
          <a routerLink="/appointments/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </a>
        </div>

        <!-- Filters -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input [formControl]="searchControl"
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all col-span-1"
              placeholder="Search appointments..." />
            <select [formControl]="statusControl"
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input [formControl]="dateControl" type="date"
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="flex items-center justify-center py-20">
          <svg class="animate-spin w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading() && appointments().length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-slate-400 text-lg">No appointments found</p>
          <a routerLink="/appointments/new" class="text-cyan-400 hover:underline text-sm mt-2 inline-block">Create one now</a>
        </div>

        <!-- Table -->
        <div *ngIf="!loading() && appointments().length > 0" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-800">
                  <th class="text-left text-slate-400 text-sm font-medium px-6 py-4">Title</th>
                  <th class="text-left text-slate-400 text-sm font-medium px-6 py-4 hidden sm:table-cell">Date & Time</th>
                  <th class="text-left text-slate-400 text-sm font-medium px-6 py-4">Status</th>
                  <th *ngIf="authService.isAdmin()" class="text-left text-slate-400 text-sm font-medium px-6 py-4 hidden md:table-cell">User</th>
                  <th class="text-right text-slate-400 text-sm font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let appt of appointments()" class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <div>
                      <p class="text-white font-medium">{{ appt.title }}</p>
                      <p *ngIf="appt.description" class="text-slate-500 text-sm truncate max-w-xs">{{ appt.description }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <p class="text-slate-300 text-sm">{{ appt.appointment_date }}</p>
                    <p class="text-slate-500 text-xs">{{ appt.appointment_time }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                      [ngClass]="{
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20': appt.status === 'pending',
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': appt.status === 'approved',
                        'bg-red-500/10 text-red-400 border border-red-500/20': appt.status === 'rejected',
                        'bg-slate-700 text-slate-400': appt.status === 'cancelled'
                      }">
                      {{ appt.status | titlecase }}
                    </span>
                  </td>
                  <td *ngIf="authService.isAdmin()" class="px-6 py-4 hidden md:table-cell">
                    <p class="text-slate-300 text-sm">{{ appt.user?.full_name || '—' }}</p>
                    <p class="text-slate-500 text-xs">{{ appt.user?.email }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/appointments', appt.id]"
                        class="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </a>
                      <a *ngIf="appt.status === 'pending'" [routerLink]="['/appointments', appt.id, 'edit']"
                        class="p-2 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button (click)="deleteAppointment(appt.id)"
                        class="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div *ngIf="meta() && meta()!.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <p class="text-slate-400 text-sm">
              Page {{ meta()!.page }} of {{ meta()!.totalPages }}
            </p>
            <div class="flex gap-2">
              <button (click)="setPage(currentPage() - 1)" [disabled]="currentPage() === 1"
                class="px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                ← Prev
              </button>
              <button (click)="setPage(currentPage() + 1)" [disabled]="currentPage() === meta()!.totalPages"
                class="px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppointmentListComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  meta = signal<PaginationMeta | null>(null);
  loading = signal(true);
  currentPage = signal(1);

  searchControl = this.fb.control('');
  statusControl = this.fb.control('');
  dateControl = this.fb.control('');

  constructor(
    private appointmentService: AppointmentService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage.set(1);
      this.loadAppointments();
    });
    this.statusControl.valueChanges.subscribe(() => { this.currentPage.set(1); this.loadAppointments(); });
    this.dateControl.valueChanges.subscribe(() => { this.currentPage.set(1); this.loadAppointments(); });
  }

  loadAppointments(): void {
    this.loading.set(true);
    const filter: AppointmentFilter = {
      page: this.currentPage(),
      limit: 10,
      search: this.searchControl.value || undefined,
      status: (this.statusControl.value as any) || undefined,
      date: this.dateControl.value || undefined,
      sort: 'created_at',
      order: 'desc',
    };
    this.appointmentService.getAll(filter).subscribe({
      next: (res) => {
        this.appointments.set(res.data || []);
        this.meta.set(res.meta || null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setPage(page: number): void {
    this.currentPage.set(page);
    this.loadAppointments();
  }

  deleteAppointment(id: string): void {
    if (!confirm('Delete this appointment?')) return;
    this.appointmentService.delete(id).subscribe({
      next: () => this.loadAppointments(),
    });
  }
}
