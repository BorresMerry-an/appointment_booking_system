import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/dashboard" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="font-bold text-white text-lg tracking-tight">AppointBook</span>
          </a>

          <!-- Nav links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/dashboard" routerLinkActive="bg-slate-800 text-white" [routerLinkActiveOptions]="{exact:true}"
              class="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-all">
              Dashboard
            </a>
            <a routerLink="/appointments" routerLinkActive="bg-slate-800 text-white"
              class="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-all">
              Appointments
            </a>
            <a *ngIf="authService.isAdmin()" routerLink="/admin" routerLinkActive="bg-slate-800 text-white"
              class="px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-all">
              Admin
            </a>
          </div>

          <!-- Right side -->
          <div class="flex items-center gap-3">
            <a routerLink="/appointments/new"
              class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New
            </a>

            <!-- User menu -->
            <div class="relative group">
              <button class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/30 to-violet-500/30 border border-slate-700 flex items-center justify-center overflow-hidden">
                  <img *ngIf="authService.currentUser()?.avatar_url" [src]="authService.currentUser()?.avatar_url" class="w-full h-full object-cover" alt="" />
                  <span *ngIf="!authService.currentUser()?.avatar_url" class="text-xs font-bold text-slate-200">
                    {{ authService.currentUser()?.full_name?.[0]?.toUpperCase() }}
                  </span>
                </div>
                <span class="text-slate-300 text-sm font-medium hidden sm:block">{{ getFirstName() }}</span>
                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div class="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div class="p-1">
                  <a routerLink="/profile" class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-sm transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Profile
                  </a>
                  <a routerLink="/appointments" class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-sm transition-all md:hidden">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Appointments
                  </a>
                  <div class="border-t border-slate-800 my-1"></div>
                  <button (click)="authService.logout()" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  getFirstName(): string {
    const fullName = this.authService.currentUser()?.full_name?.trim();
    return fullName ? fullName.split(' ')[0] : '';
  }
}
