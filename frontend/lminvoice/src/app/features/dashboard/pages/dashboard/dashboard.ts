import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { User } from '../../../../core/models/user';
import { InvoiceService } from '../../../invoices/services/invoiceService';
import { Invoice } from '../../../invoices/models/invoice';
import { InvoiceAgentService } from '../../../agent/services/invoice-agent.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private authService = inject(Auth);
  private invoiceService = inject(InvoiceService);
  private invoiceAgentService = inject(InvoiceAgentService);
  private router = inject(Router);

  user = signal<User | null>(this.authService.getUser());
  invoices = signal<Invoice[]>([]);
  loading = signal(true);
  agentLoading = signal(false);
  agentQuestion = signal('monthly revenue');
  agentAnswer = signal('');

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

  askAgent(message = this.agentQuestion()): void {
    const question = message.trim();

    if (!question) {
      return;
    }

    this.agentQuestion.set(question);
    this.agentLoading.set(true);
    this.invoiceAgentService.ask(question).subscribe({
      next: answer => {
        this.agentAnswer.set(answer);
        this.agentLoading.set(false);
      },
      error: () => {
        this.agentAnswer.set('No se pudo consultar el agente local.');
        this.agentLoading.set(false);
      }
    });
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
