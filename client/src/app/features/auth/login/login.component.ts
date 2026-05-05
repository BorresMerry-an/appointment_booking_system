import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-2xl mb-4 shadow-2xl shadow-cyan-500/20">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">AppointBook</h1>
          <p class="text-slate-400 mt-1 text-sm">Sign in to your account</p>
        </div>

        <!-- Session expired message -->
        <div *ngIf="sessionExpired" class="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm text-center">
          Your session expired. Please sign in again.
        </div>

        <!-- Card -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
              <p *ngIf="f['email'].touched && f['email'].errors?.['required']" class="text-red-400 text-xs mt-1">Email is required</p>
              <p *ngIf="f['email'].touched && f['email'].errors?.['email']" class="text-red-400 text-xs mt-1">Enter a valid email</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  <svg *ngIf="!showPassword()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg *ngIf="showPassword()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="f['password'].touched && f['password'].errors?.['required']" class="text-red-400 text-xs mt-1">Password is required</p>
            </div>

            <!-- Error -->
            <div *ngIf="errorMsg()" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {{ errorMsg() }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <svg *ngIf="loading()" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center text-slate-400 text-sm mt-6">
            Don't have an account?
            <a routerLink="/auth/register" class="text-cyan-400 hover:text-cyan-300 font-medium ml-1">Create one</a>
          </p>
        </div>

        <!-- Demo credentials -->
        <div class="mt-4 p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
          Admin: <span class="text-slate-300">admin&#64;appointbook.dev</span> / <span class="text-slate-300">Admin123!</span>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  showPassword = signal(false);
  loading = signal(false);
  errorMsg = signal('');
  sessionExpired = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.sessionExpired = !!this.route.snapshot.queryParams['expired'];
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login(this.form.value).subscribe({
      next: () => { /* authService handles redirect */ },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
