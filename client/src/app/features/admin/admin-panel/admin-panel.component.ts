import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, PaginationMeta } from '../../../core/models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
              <span class="text-violet-400 text-sm font-medium uppercase tracking-wider">Admin</span>
            </div>
            <h1 class="text-3xl font-bold text-white">Appointment Management</h1>
          </div>
          <a routerLink="/admin/users"
            class="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Users
          </a>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div *ngFor="let stat of statCards()" class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs font-medium mb-2" [ngClass]="stat.color">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search by title..."
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
            <select [(ngModel)]="statusFilter" (ngModelChange)="loadAppointments()"
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input type="date" [(ngModel)]="dateFilter" (ngModelChange)="loadAppointments()"
              class="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
          </div>
        </div>

        <!-- Table -->
        <div *ngIf="loading()" class="flex justify-center py-20">
          <svg class="animate-spin w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <div *ngIf="!loading()" class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-800">
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Title</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider hidden md:table-cell">User</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider hidden sm:table-cell">Date/Time</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Status</th>
                  <th class="text-right text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let appt of appointments()" class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td class="px-6 py-4">
                    <p class="text-white font-medium">{{ appt.title }}</p>
                    <p *ngIf="appt.notes" class="text-slate-500 text-xs truncate max-w-xs">{{ appt.notes }}</p>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <p class="text-slate-300 text-sm">{{ appt.user?.full_name || '—' }}</p>
                    <p class="text-slate-500 text-xs">{{ appt.user?.email }}</p>
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
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <a [routerLink]="['/appointments', appt.id]"
                        class="text-xs px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all">
                        View
                      </a>
                      <button *ngIf="appt.status === 'pending'" (click)="quickApprove(appt.id)"
                        class="text-xs px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        Approve
                      </button>
                      <button *ngIf="appt.status === 'pending'" (click)="quickReject(appt.id)"
                        class="text-xs px-3 py-1.5 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="appointments().length === 0">
                  <td colspan="5" class="text-center text-slate-500 py-16">No appointments found</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div *ngIf="meta() && meta()!.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <p class="text-slate-400 text-sm">Page {{ meta()!.page }} of {{ meta()!.totalPages }} — {{ meta()!.total }} total</p>
            <div class="flex gap-2">
              <button (click)="setPage(currentPage() - 1)" [disabled]="currentPage() === 1"
                class="px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">← Prev</button>
              <button (click)="setPage(currentPage() + 1)" [disabled]="currentPage() === meta()!.totalPages"
                class="px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminPanelComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  meta = signal<PaginationMeta | null>(null);
  statCards = signal<{ label: string; value: number; color: string }[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  search = '';
  statusFilter = '';
  dateFilter = '';
  private searchTimer: any;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadStats();
  }

  loadStats(): void {
    this.appointmentService.getStats().subscribe({
      next: (res) => {
        const d = res.data || {};
        this.statCards.set([
          { label: 'Total', value: d['total'] || 0, color: 'text-slate-300' },
          { label: 'Pending', value: d['pending'] || 0, color: 'text-amber-400' },
          { label: 'Approved', value: d['approved'] || 0, color: 'text-emerald-400' },
          { label: 'Rejected', value: d['rejected'] || 0, color: 'text-red-400' },
          { label: 'Cancelled', value: d['cancelled'] || 0, color: 'text-slate-400' },
        ]);
      },
    });
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.appointmentService.getAll({
      page: this.currentPage(),
      limit: 15,
      search: this.search || undefined,
      status: (this.statusFilter as any) || undefined,
      date: this.dateFilter || undefined,
      sort: 'created_at',
      order: 'desc',
    }).subscribe({
      next: (res) => {
        this.appointments.set(res.data || []);
        this.meta.set(res.meta || null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage.set(1); this.loadAppointments(); }, 400);
  }

  setPage(page: number): void { this.currentPage.set(page); this.loadAppointments(); }

  quickApprove(id: string): void {
    this.appointmentService.updateStatus(id, 'approved').subscribe({
      next: () => { this.loadAppointments(); this.loadStats(); },
    });
  }

  quickReject(id: string): void {
    this.appointmentService.updateStatus(id, 'rejected').subscribe({
      next: () => { this.loadAppointments(); this.loadStats(); },
    });
  }
}
