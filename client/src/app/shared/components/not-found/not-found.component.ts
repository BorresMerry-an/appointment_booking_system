import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div class="text-center">
        <p class="text-8xl font-black bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-4">404</p>
        <h1 class="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p class="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
          ← Go to Dashboard
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
