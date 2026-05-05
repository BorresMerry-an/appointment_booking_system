import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list.component').then(
            (m) => m.AppointmentListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/appointments/appointment-form/appointment-form.component').then(
            (m) => m.AppointmentFormComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/appointments/appointment-form/appointment-form.component').then(
            (m) => m.AppointmentFormComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/appointments/appointment-detail/appointment-detail.component').then(
            (m) => m.AppointmentDetailComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
