import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { UploadService } from '../../core/services/upload.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-xl mx-auto">
        <h1 class="text-3xl font-bold text-white mb-2">Profile</h1>
        <p class="text-slate-400 mb-8">Manage your account details</p>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <!-- Avatar -->
          <div class="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
            <div class="relative">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center overflow-hidden">
                <img *ngIf="authService.currentUser()?.avatar_url" [src]="authService.currentUser()?.avatar_url" class="w-full h-full object-cover" alt="Avatar" />
                <span *ngIf="!authService.currentUser()?.avatar_url" class="text-2xl font-bold text-white">
                  {{ authService.currentUser()?.full_name?.[0]?.toUpperCase() }}
                </span>
              </div>
              <button (click)="avatarInput.click()" class="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg flex items-center justify-center transition-all">
                <svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
              <input #avatarInput type="file" class="hidden" accept="image/*" (change)="onAvatarChange($event)" />
            </div>
            <div>
              <p class="text-white font-semibold text-lg">{{ authService.currentUser()?.full_name }}</p>
              <p class="text-slate-400 text-sm">{{ authService.currentUser()?.email }}</p>
              <span class="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                [ngClass]="authService.isAdmin() ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-slate-700 text-slate-300'">
                {{ authService.currentUser()?.role | titlecase }}
              </span>
            </div>
          </div>

          <!-- Form -->
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" formControlName="full_name"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
              <p *ngIf="f['full_name'].touched && f['full_name'].errors?.['required']" class="text-red-400 text-xs mt-1">Full name is required</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" [value]="authService.currentUser()?.email" disabled
                class="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-500 cursor-not-allowed" />
              <p class="text-slate-600 text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
              <input type="tel" formControlName="phone"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="+63 900 000 0000" />
            </div>

            <div *ngIf="successMsg()" class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              {{ successMsg() }}
            </div>
            <div *ngIf="errorMsg()" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {{ errorMsg() }}
            </div>

            <button type="submit" [disabled]="form.invalid || loading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              <svg *ngIf="loading()" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading() ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private userService: UserService,
    private uploadService: UploadService
  ) {
    this.form = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
    });
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.form.patchValue({ full_name: user.full_name, phone: user.phone || '' });
    }
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadService.uploadFile(file, 'avatars').subscribe({
      next: (res) => {
        if (res.data) {
          this.userService.update(this.authService.currentUser()!.id, { avatar_url: res.data.url }).subscribe({
            next: () => this.authService.getMe().subscribe(),
          });
        }
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.userService.update(this.authService.currentUser()!.id, this.form.value).subscribe({
      next: () => {
        this.authService.getMe().subscribe();
        this.successMsg.set('Profile updated successfully!');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Update failed.');
        this.loading.set(false);
      },
    });
  }
}
