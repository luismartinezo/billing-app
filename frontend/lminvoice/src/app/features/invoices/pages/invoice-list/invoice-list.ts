import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../services/invoice';

@Component({
  selector: 'app-invoice-list',
  imports: [CommonModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.css',
})
export class InvoiceList implements OnInit {
  invoices: any[] = [];
  loading = false;

  constructor(private invoiceService: Invoice) {}

  ngOnInit(): void {
    this.loading = true;
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
