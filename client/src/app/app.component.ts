import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950">
      <app-navbar *ngIf="authService.isLoggedIn()" />
      <main [class.pt-16]="authService.isLoggedIn()">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
