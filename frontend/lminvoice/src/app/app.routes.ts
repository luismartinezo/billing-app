import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(
        m => m.Login
      )
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard').then(
        m => m.Dashboard
      )
  },
  {
  path: 'invoices',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/invoices/pages/invoice-list/invoice-list').then(
      m => m.InvoiceList
    )
},
{
  path: 'invoices/new',
  loadComponent: () =>
    import('./features/invoices/pages/invoice-form/invoice-form')
      .then(m => m.InvoiceForm)
},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
