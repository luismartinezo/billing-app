import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoiceService';

@Component({
  selector: 'app-invoice-list',
  imports: [],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceList {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  loading = signal(false);

  constructor() {
    effect(() => {
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
    });
  }
}
