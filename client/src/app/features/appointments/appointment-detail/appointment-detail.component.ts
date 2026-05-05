import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Appointment } from '../../../core/models';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-2xl mx-auto">
        <a routerLink="/appointments" class="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-6 transition-colors">
          ← Back to Appointments
        </a>

        <div *ngIf="loading()" class="flex justify-center py-20">
          <svg class="animate-spin w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <div *ngIf="!loading() && appointment()">
          <!-- Header card -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 class="text-2xl font-bold text-white">{{ appointment()!.title }}</h1>
                <p class="text-slate-400 text-sm mt-1">Created {{ appointment()!.created_at | date:'mediumDate' }}</p>
              </div>
              <span class="text-sm px-3 py-1.5 rounded-full font-medium flex-shrink-0"
                [ngClass]="{
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20': appointment()!.status === 'pending',
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': appointment()!.status === 'approved',
                  'bg-red-500/10 text-red-400 border border-red-500/20': appointment()!.status === 'rejected',
                  'bg-slate-700 text-slate-400': appointment()!.status === 'cancelled'
                }">
                {{ appointment()!.status | titlecase }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-slate-800 rounded-xl p-4">
                <p class="text-slate-500 text-xs mb-1">Date</p>
                <p class="text-white font-medium">{{ appointment()!.appointment_date }}</p>
              </div>
              <div class="bg-slate-800 rounded-xl p-4">
                <p class="text-slate-500 text-xs mb-1">Time</p>
                <p class="text-white font-medium">{{ appointment()!.appointment_time }}</p>
              </div>
            </div>

            <div *ngIf="appointment()!.description" class="mb-4">
              <p class="text-slate-500 text-xs mb-1">Description</p>
              <p class="text-slate-200">{{ appointment()!.description }}</p>
            </div>

            <div *ngIf="appointment()!.notes" class="mb-4">
              <p class="text-slate-500 text-xs mb-1">Your Notes</p>
              <p class="text-slate-200">{{ appointment()!.notes }}</p>
            </div>

            <div *ngIf="appointment()!.admin_notes" class="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl">
              <p class="text-violet-400 text-xs font-medium mb-1">Admin Notes</p>
              <p class="text-slate-200 text-sm">{{ appointment()!.admin_notes }}</p>
            </div>
          </div>

          <!-- Attachment -->
          <div *ngIf="appointment()!.file_url" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
            <h2 class="text-slate-300 font-medium mb-3">Attachment</h2>
            <a [href]="appointment()!.file_url" target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all text-sm">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              View Attachment
            </a>
          </div>

          <!-- Admin status panel -->
          <div *ngIf="authService.isAdmin() && appointment()!.status === 'pending'" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
            <h2 class="text-white font-semibold mb-4">Admin Actions</h2>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Admin Notes (optional)</label>
              <textarea [(ngModel)]="adminNotes" rows="2"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none mb-3"
                placeholder="Reason or notes for decision..."></textarea>
              <div class="flex gap-3">
                <button (click)="updateStatus('approved')" [disabled]="actionLoading()"
                  class="flex-1 py-2.5 px-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/30 disabled:opacity-50 transition-all">
                  ✓ Approve
                </button>
                <button (click)="updateStatus('rejected')" [disabled]="actionLoading()"
                  class="flex-1 py-2.5 px-4 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all">
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>

          <!-- User actions -->
          <div class="flex gap-3">
            <a *ngIf="appointment()!.status === 'pending'" [routerLink]="['/appointments', appointment()!.id, 'edit']"
              class="flex-1 py-2.5 px-4 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-all text-center text-sm">
              Edit
            </a>
            <button (click)="deleteAppointment()" [disabled]="actionLoading()"
              class="flex-1 py-2.5 px-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 disabled:opacity-50 transition-all text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppointmentDetailComponent implements OnInit {
  appointment = signal<Appointment | null>(null);
  loading = signal(true);
  actionLoading = signal(false);
  adminNotes = '';

  constructor(
    private appointmentService: AppointmentService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.appointmentService.getById(id).subscribe({
      next: (res) => { this.appointment.set(res.data || null); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/appointments']); },
    });
  }

  updateStatus(status: 'approved' | 'rejected'): void {
    if (!this.appointment()) return;
    this.actionLoading.set(true);
    this.appointmentService.updateStatus(this.appointment()!.id, status, this.adminNotes).subscribe({
      next: (res) => { this.appointment.set(res.data || null); this.actionLoading.set(false); },
      error: () => this.actionLoading.set(false),
    });
  }

  deleteAppointment(): void {
    if (!confirm('Delete this appointment?')) return;
    this.actionLoading.set(true);
    this.appointmentService.delete(this.appointment()!.id).subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: () => this.actionLoading.set(false),
    });
  }
}
