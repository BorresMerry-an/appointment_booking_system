import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, PaginationMeta } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <a routerLink="/admin" class="text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 mb-2 transition-colors">← Admin Panel</a>
            <h1 class="text-3xl font-bold text-white">User Management</h1>
            <p class="text-slate-400 mt-1">{{ meta()?.total || 0 }} registered users</p>
          </div>
        </div>

        <!-- Search -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <input [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search by name or email..."
            class="w-full sm:w-80 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" />
        </div>

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
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">User</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Role</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Status</th>
                  <th class="text-left text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th class="text-right text-slate-400 text-xs font-medium px-6 py-4 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users()" class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <span class="text-sm font-semibold text-slate-200">{{ user.full_name[0].toUpperCase() }}</span>
                      </div>
                      <div>
                        <p class="text-white font-medium text-sm">{{ user.full_name }}</p>
                        <p class="text-slate-500 text-xs">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <p class="text-slate-300 text-sm">{{ user.phone || '—' }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                      [ngClass]="user.role === 'admin' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-slate-700 text-slate-300'">
                      {{ user.role | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                      [ngClass]="user.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'">
                      {{ user.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <p class="text-slate-400 text-sm">{{ user.created_at | date:'mediumDate' }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button *ngIf="user.id !== authService.currentUser()?.id"
                        (click)="toggleStatus(user)"
                        class="text-xs px-3 py-1.5 rounded-lg transition-all"
                        [ngClass]="user.is_active ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20'">
                        {{ user.is_active ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button *ngIf="user.id !== authService.currentUser()?.id"
                        (click)="deleteUser(user.id)"
                        class="text-xs px-3 py-1.5 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
                        Delete
                      </button>
                      <span *ngIf="user.id === authService.currentUser()?.id" class="text-slate-600 text-xs">You</span>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="users().length === 0">
                  <td colspan="6" class="text-center text-slate-500 py-16">No users found</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="meta() && meta()!.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <p class="text-slate-400 text-sm">Page {{ meta()!.page }} of {{ meta()!.totalPages }}</p>
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
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  meta = signal<PaginationMeta | null>(null);
  loading = signal(true);
  currentPage = signal(1);
  search = '';
  private searchTimer: any;

  constructor(private userService: UserService, public authService: AuthService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading.set(true);
    const params: Record<string, string | number> = {
      page: this.currentPage(),
      limit: 15,
      sort: 'created_at',
      order: 'desc',
    };
    if (this.search) params['search'] = this.search;
    this.userService.getAll(params).subscribe({
      next: (res) => { this.users.set(res.data || []); this.meta.set(res.meta || null); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage.set(1); this.loadUsers(); }, 400);
  }

  setPage(page: number): void { this.currentPage.set(page); this.loadUsers(); }

  toggleStatus(user: User): void {
    this.userService.toggleStatus(user.id).subscribe({ next: () => this.loadUsers() });
  }

  deleteUser(id: string): void {
    if (!confirm('Permanently delete this user?')) return;
    this.userService.delete(id).subscribe({ next: () => this.loadUsers() });
  }
}
