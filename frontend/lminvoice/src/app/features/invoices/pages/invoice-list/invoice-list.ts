import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoiceService';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-invoice-list',
  imports: [RouterLink, CurrencyPipe, TranslatePipe],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceList {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  selectedStatus = signal('ALL');

  constructor() {
    this.loadInvoices();
  }

  filteredInvoices = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.invoices().filter(invoice => {
      const matchesStatus = status === 'ALL' || invoice.status === status;
      const haystack = [
        invoice.invoiceNumber,
        invoice.customer?.name,
        invoice.status
      ].join(' ').toLowerCase();

      return matchesStatus && (!term || haystack.includes(term));
    });
  });

  loadInvoices(): void {
    this.loading.set(true);
    this.invoiceService.getAll().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  setStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  statusClass(status?: string): string {
    return `status-${(status || 'unknown').toLowerCase()}`;
  }
}
