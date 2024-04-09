import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'events',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/events/events.page').then((m) => m.EventsPage),
        children: [],
      },
      {
        path: 'events/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/events/event/event.page').then((m) => m.EventPage),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
];
