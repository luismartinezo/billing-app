import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(
        m => m.Login
      )
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(
        m => m.Register
      )
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/app-shell/app-shell').then(m => m.AppShell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then(
            m => m.Dashboard
          )
      },
      {
        path: 'invoices',
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
        path: 'invoices/:id',
        loadComponent: () =>
          import('./features/invoices/pages/invoice-detail/invoice-detail')
            .then(m => m.InvoiceDetail)
      },
      {
        path: 'customers',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_OWNER'] },
        loadComponent: () =>
          import('./features/customers/pages/customer-list/customer-list')
            .then(m => m.CustomerList)
      },
      {
        path: 'products',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_OWNER'] },
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list')
            .then(m => m.ProductList)
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_OWNER'] },
        loadComponent: () =>
          import('./features/reports/pages/reports-dashboard/reports-dashboard')
            .then(m => m.ReportsDashboard)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_OWNER'] },
        loadComponent: () =>
          import('./features/users/pages/user-management/user-management')
            .then(m => m.UserManagement)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
