import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white">
            Welcome back, <span class="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{{ authService.currentUser()?.full_name }}</span>
          </h1>
          <p class="text-slate-400 mt-1">Here's what's happening with your appointments.</p>
        </div>

        <!-- Stats cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-slate-400 text-sm">Total</span>
              <div class="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p class="text-2xl font-bold text-white">{{ stats()['total'] || 0 }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-amber-400 text-sm">Pending</span>
              <div class="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
            <p class="text-2xl font-bold text-white">{{ stats()['pending'] || 0 }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-emerald-400 text-sm">Approved</span>
              <div class="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            </div>
            <p class="text-2xl font-bold text-white">{{ stats()['approved'] || 0 }}</p>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-red-400 text-sm">Rejected</span>
              <div class="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
            </div>
            <p class="text-2xl font-bold text-white">{{ stats()['rejected'] || 0 }}</p>
          </div>
        </div>

        <!-- Quick actions + recent -->
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Quick Actions -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-white font-semibold mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <a routerLink="/appointments/new"
                class="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group">
                <div class="w-9 h-9 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span class="text-slate-200 group-hover:text-white font-medium">New Appointment</span>
              </a>
              <a routerLink="/appointments"
                class="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all group">
                <div class="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <span class="text-slate-300 group-hover:text-white font-medium">View All</span>
              </a>
              <a *ngIf="authService.isAdmin()" routerLink="/admin"
                class="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group">
                <div class="w-9 h-9 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="text-violet-300 group-hover:text-violet-200 font-medium">Admin Panel</span>
              </a>
            </div>
          </div>

          <!-- Recent Appointments -->
          <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-white font-semibold">Recent Appointments</h2>
              <a routerLink="/appointments" class="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">View all →</a>
            </div>

            <div *ngIf="loading()" class="flex items-center justify-center py-10">
              <svg class="animate-spin w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>

            <div *ngIf="!loading() && appointments().length === 0" class="text-center py-10 text-slate-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No appointments yet.</p>
              <a routerLink="/appointments/new" class="text-cyan-400 hover:underline text-sm mt-1 inline-block">Book your first one</a>
            </div>

            <div *ngIf="!loading()" class="space-y-3">
              <div *ngFor="let appt of appointments()" class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer" [routerLink]="['/appointments', appt.id]">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  [ngClass]="{
                    'bg-amber-500/10': appt.status === 'pending',
                    'bg-emerald-500/10': appt.status === 'approved',
                    'bg-red-500/10': appt.status === 'rejected',
                    'bg-slate-700': appt.status === 'cancelled'
                  }">
                  <div class="w-2.5 h-2.5 rounded-full"
                    [ngClass]="{
                      'bg-amber-400': appt.status === 'pending',
                      'bg-emerald-400': appt.status === 'approved',
                      'bg-red-400': appt.status === 'rejected',
                      'bg-slate-400': appt.status === 'cancelled'
                    }"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-slate-200 font-medium truncate">{{ appt.title }}</p>
                  <p class="text-slate-500 text-sm">{{ appt.appointment_date }} at {{ appt.appointment_time }}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                  [ngClass]="{
                    'bg-amber-500/10 text-amber-400': appt.status === 'pending',
                    'bg-emerald-500/10 text-emerald-400': appt.status === 'approved',
                    'bg-red-500/10 text-red-400': appt.status === 'rejected',
                    'bg-slate-700 text-slate-400': appt.status === 'cancelled'
                  }">
                  {{ appt.status | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  stats = signal<Record<string, number>>({});
  loading = signal(true);

  constructor(public authService: AuthService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.appointmentService.getAll({ limit: 5, sort: 'created_at', order: 'desc' }).subscribe({
      next: (res) => {
        this.appointments.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    if (this.authService.isAdmin()) {
      this.appointmentService.getStats().subscribe({
        next: (res) => this.stats.set(res.data || {}),
      });
    } else {
      // Build stats from user's own appointments
      this.appointmentService.getAll({ limit: 100 }).subscribe({
        next: (res) => {
          const appts = res.data || [];
          this.stats.set({
            total: appts.length,
            pending: appts.filter((a) => a.status === 'pending').length,
            approved: appts.filter((a) => a.status === 'approved').length,
            rejected: appts.filter((a) => a.status === 'rejected').length,
          });
        },
      });
    }
  }
}
