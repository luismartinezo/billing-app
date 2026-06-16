import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { Invoice } from '../../../invoices/models/invoice';
import { InvoiceService } from '../../../invoices/services/invoiceService';

interface MonthlyRevenue {
  key: string;
  label: string;
  total: number;
}

interface ClientRevenue {
  name: string;
  total: number;
  invoices: number;
}

@Component({
  selector: 'app-reports-dashboard',
  imports: [CurrencyPipe, RouterLink, TranslatePipe],
  templateUrl: './reports-dashboard.html',
  styleUrl: './reports-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsDashboard {
  private invoiceService = inject(InvoiceService);
  private translationService = inject(TranslationService);

  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  paidInvoices = computed(() => this.invoices().filter(invoice => invoice.status === 'PAID'));
  pendingInvoices = computed(() => this.invoices().filter(invoice => invoice.status === 'PENDING'));
  totalRevenue = computed(() => this.sumInvoices(this.paidInvoices()));
  pendingAmount = computed(() => this.sumInvoices(this.pendingInvoices()));
  averageInvoice = computed(() => {
    const invoices = this.invoices();
    return invoices.length ? this.sumInvoices(invoices) / invoices.length : 0;
  });
  collectionRate = computed(() => {
    const total = this.invoices().length;
    return total ? Math.round((this.paidInvoices().length / total) * 100) : 0;
  });
  monthlyRevenue = computed(() => this.buildMonthlyRevenue());
  topClients = computed(() => this.buildTopClients());
  highestMonthlyRevenue = computed(() => {
    return Math.max(...this.monthlyRevenue().map(month => month.total), 0);
  });
  highestClientRevenue = computed(() => {
    return Math.max(...this.topClients().map(client => client.total), 0);
  });

  constructor() {
    this.loadInvoices();
  }

  barWidth(value: number, max: number): string {
    if (!max) {
      return '0%';
    }

    return `${Math.max(Math.round((value / max) * 100), value > 0 ? 8 : 0)}%`;
  }

  statusLabel(status: string): string {
    return this.translationService.translate(`status.${status || 'UNKNOWN'}`);
  }

  statusCount(status: string): number {
    return this.invoices().filter(invoice => invoice.status === status).length;
  }

  private loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll().subscribe({
      next: invoices => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('reports.loadError'));
        this.loading.set(false);
      }
    });
  }

  private buildMonthlyRevenue(): MonthlyRevenue[] {
    this.translationService.language();

    const buckets = new Map<string, MonthlyRevenue>();
    const today = new Date();

    for (let index = 5; index >= 0; index--) {
      const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
      const key = this.monthKey(date);
      buckets.set(key, {
        key,
        label: this.monthLabel(date),
        total: 0
      });
    }

    for (const invoice of this.paidInvoices()) {
      const date = this.invoiceDate(invoice);
      const key = this.monthKey(date);
      const bucket = buckets.get(key);

      if (bucket) {
        bucket.total += Number(invoice.total ?? 0);
      }
    }

    return Array.from(buckets.values());
  }

  private buildTopClients(): ClientRevenue[] {
    const clients = new Map<string, ClientRevenue>();

    for (const invoice of this.invoices()) {
      const name = invoice.customer?.name || this.translationService.translate('invoice.noCustomer');
      const current = clients.get(name) ?? { name, total: 0, invoices: 0 };
      current.total += Number(invoice.total ?? 0);
      current.invoices += 1;
      clients.set(name, current);
    }

    return Array.from(clients.values())
      .sort((first, second) => second.total - first.total)
      .slice(0, 5);
  }

  private invoiceDate(invoice: Invoice): Date {
    return new Date(invoice.paidAt || invoice.issueDate || invoice.createdAt || new Date());
  }

  private monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private monthLabel(date: Date): string {
    const locale = this.translationService.language() === 'es' ? 'es-ES' : 'en-US';
    return new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
  }

  private sumInvoices(invoices: Invoice[]): number {
    return invoices.reduce((total, invoice) => total + Number(invoice.total ?? 0), 0);
  }
}
