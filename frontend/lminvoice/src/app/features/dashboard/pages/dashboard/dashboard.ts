import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { User } from '../../../../core/models/user';
import { InvoiceService } from '../../../invoices/services/invoiceService';
import { Invoice } from '../../../invoices/models/invoice';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private authService = inject(Auth);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  user = signal<User | null>(this.authService.getUser());
  invoices = signal<Invoice[]>([]);
  loading = signal(true);

  totalInvoices = computed(() => this.invoices().length);
  pendingInvoices = computed(() => this.invoices().filter(invoice => invoice.status === 'PENDING').length);
  paidInvoices = computed(() => this.invoices().filter(invoice => invoice.status === 'PAID').length);
  totalRevenue = computed(() => {
    return this.invoices()
      .filter(invoice => invoice.status === 'PAID')
      .reduce((total, invoice) => total + Number(invoice.total ?? 0), 0);
  });
  recentInvoices = computed(() => this.invoices().slice(0, 5));

  constructor() {
    this.loadInvoices();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll().subscribe({
      next: invoices => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
