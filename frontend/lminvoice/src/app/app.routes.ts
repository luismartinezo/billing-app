import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth-guard';

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
        loadComponent: () =>
          import('./features/customers/pages/customer-list/customer-list')
            .then(m => m.CustomerList)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list')
            .then(m => m.ProductList)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/reports-dashboard/reports-dashboard')
            .then(m => m.ReportsDashboard)
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
