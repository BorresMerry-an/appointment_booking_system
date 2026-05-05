import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { UploadService } from '../../../core/services/upload.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-2xl mx-auto">
        <div class="mb-6">
          <a routerLink="/appointments" class="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back to Appointments
          </a>
          <h1 class="text-3xl font-bold text-white">{{ isEdit ? 'Edit' : 'New' }} Appointment</h1>
          <p class="text-slate-400 mt-1">{{ isEdit ? 'Update your appointment details' : 'Fill in the details to book an appointment' }}</p>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
              <input type="text" formControlName="title"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="e.g. Annual Health Check-up" />
              <p *ngIf="f['title'].touched && f['title'].errors?.['required']" class="text-red-400 text-xs mt-1">Title is required</p>
              <p *ngIf="f['title'].touched && f['title'].errors?.['minlength']" class="text-red-400 text-xs mt-1">At least 3 characters</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea formControlName="description" rows="3"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Brief description of the appointment..."></textarea>
            </div>

            <!-- Date & Time -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Date *</label>
                <input type="date" formControlName="appointment_date"
                  [min]="minDate"
                  class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                <p *ngIf="f['appointment_date'].touched && f['appointment_date'].errors?.['required']" class="text-red-400 text-xs mt-1">Date is required</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Time *</label>
                <input type="time" formControlName="appointment_time"
                  class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
                <p *ngIf="f['appointment_time'].touched && f['appointment_time'].errors?.['required']" class="text-red-400 text-xs mt-1">Time is required</p>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
              <textarea formControlName="notes" rows="2"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Any additional notes..."></textarea>
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Attachment</label>
              <div class="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-colors cursor-pointer"
                (click)="fileInput.click()">
                <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*,.pdf,.doc,.docx" />
                <svg class="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-slate-400 text-sm">{{ selectedFile ? selectedFile.name : 'Click to upload or drag & drop' }}</p>
                <p class="text-slate-600 text-xs mt-1">Images, PDF, DOC up to 5MB</p>
              </div>
              <div *ngIf="uploadLoading()" class="mt-2 flex items-center gap-2 text-cyan-400 text-sm">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Uploading file...
              </div>
              <div *ngIf="fileUrl()" class="mt-2 text-emerald-400 text-sm flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                File uploaded successfully
              </div>
            </div>

            <!-- Error -->
            <div *ngIf="errorMsg()" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {{ errorMsg() }}
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-2">
              <a routerLink="/appointments"
                class="flex-1 py-3 px-4 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-all text-center">
                Cancel
              </a>
              <button type="submit" [disabled]="form.invalid || loading() || uploadLoading()"
                class="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                <svg *ngIf="loading()" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {{ loading() ? 'Saving...' : (isEdit ? 'Update' : 'Book Appointment') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AppointmentFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  appointmentId = '';
  minDate = new Date().toISOString().split('T')[0];
  selectedFile: File | null = null;
  fileUrl = signal('');
  loading = signal(false);
  uploadLoading = signal(false);
  errorMsg = signal('');

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: [''],
      appointment_date: ['', Validators.required],
      appointment_time: ['', Validators.required],
      notes: [''],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.params['id'];
    if (this.appointmentId) {
      this.isEdit = true;
      this.appointmentService.getById(this.appointmentId).subscribe({
        next: (res) => {
          if (res.data) {
            this.form.patchValue(res.data);
            if (res.data.file_url) this.fileUrl.set(res.data.file_url);
          }
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    this.uploadLoading.set(true);
    this.uploadService.uploadFile(file).subscribe({
      next: (res) => {
        if (res.data) this.fileUrl.set(res.data.url);
        this.uploadLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('File upload failed. Try again.');
        this.uploadLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    const payload = { ...this.form.value, file_url: this.fileUrl() || undefined };

    const request$ = this.isEdit
      ? this.appointmentService.update(this.appointmentId, payload)
      : this.appointmentService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/appointments']),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Something went wrong.');
        this.loading.set(false);
      },
    });
  }
}
