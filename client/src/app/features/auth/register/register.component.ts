import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  return password && confirm && password.value !== confirm.value ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-2xl mb-4 shadow-2xl shadow-violet-500/20">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p class="text-slate-400 mt-1 text-sm">Join AppointBook today</p>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input type="text" formControlName="full_name"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Juan dela Cruz" />
              <p *ngIf="f['full_name'].touched && f['full_name'].errors?.['required']" class="text-red-400 text-xs mt-1">Full name is required</p>
              <p *ngIf="f['full_name'].touched && f['full_name'].errors?.['minlength']" class="text-red-400 text-xs mt-1">At least 2 characters</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" formControlName="email"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="you@example.com" />
              <p *ngIf="f['email'].touched && f['email'].errors?.['required']" class="text-red-400 text-xs mt-1">Email is required</p>
              <p *ngIf="f['email'].touched && f['email'].errors?.['email']" class="text-red-400 text-xs mt-1">Enter a valid email</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Phone <span class="text-slate-500">(optional)</span></label>
              <input type="tel" formControlName="phone"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="+63 900 000 0000" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" formControlName="password"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Min. 8 chars with uppercase & number" />
              <p *ngIf="f['password'].touched && f['password'].errors?.['required']" class="text-red-400 text-xs mt-1">Password is required</p>
              <p *ngIf="f['password'].touched && f['password'].errors?.['minlength']" class="text-red-400 text-xs mt-1">At least 8 characters</p>
              <p *ngIf="f['password'].touched && f['password'].errors?.['pattern']" class="text-red-400 text-xs mt-1">Must contain uppercase, lowercase, and a number</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input type="password" formControlName="confirmPassword"
                class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Repeat your password" />
              <p *ngIf="form.errors?.['mismatch'] && f['confirmPassword'].touched" class="text-red-400 text-xs mt-1">Passwords do not match</p>
            </div>

            <div *ngIf="errorMsg()" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {{ errorMsg() }}
            </div>

            <button type="submit" [disabled]="form.invalid || loading()"
              class="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 mt-2">
              <svg *ngIf="loading()" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ loading() ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <p class="text-center text-slate-400 text-sm mt-6">
            Already have an account?
            <a routerLink="/auth/login" class="text-cyan-400 hover:text-cyan-300 font-medium ml-1">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  form: FormGroup;
  loading = signal(false);
  errorMsg = signal('');

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    const { confirmPassword, ...payload } = this.form.value;

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
