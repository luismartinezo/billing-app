import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreatePayment, Invoice, Payment, PaymentMethod } from '../../models/invoice';
import { InvoiceService } from '../../services/invoiceService';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { Auth } from '../../../../core/services/auth';

type ConfirmationAction = 'cancel' | 'delete';

@Component({
  selector: 'app-invoice-detail',
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private translationService = inject(TranslationService);
  private authService = inject(Auth);

  invoice = signal<Invoice | null>(null);
  payments = signal<Payment[]>([]);
  loading = signal(true);
  savingPayment = signal(false);
  actionLoading = signal(false);
  downloadingPdf = signal(false);
  confirmationAction = signal<ConfirmationAction | null>(null);
  errorMessage = signal('');
  successMessage = signal('');
  paymentAmount = signal<number | null>(null);
  paymentMethod = signal<PaymentMethod>('CASH');

  invoiceId = computed(() => Number(this.route.snapshot.paramMap.get('id')));
  totalPaid = computed(() => this.payments().reduce((sum, payment) => sum + Number(payment.amount), 0));
  remainingAmount = computed(() => Math.max(Number(this.invoice()?.total ?? 0) - this.totalPaid(), 0));
  isManager = this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_OWNER']);
  canIssue = computed(() => this.invoice()?.status === 'DRAFT');
  canPay = computed(() => ['ISSUED', 'OVERDUE'].includes(this.invoice()?.status ?? '') && this.remainingAmount() > 0);
  canCancel = computed(() => this.isManager && !['PAID', 'CANCELLED'].includes(this.invoice()?.status ?? ''));
  canDelete = computed(() => this.isManager && ['DRAFT', 'CANCELLED'].includes(this.invoice()?.status ?? ''));

  constructor() {
    this.loadInvoice();
  }

  addPayment(): void {
    this.clearMessages();

    const amount = Number(this.paymentAmount());
    if (!amount || amount <= 0) {
      this.errorMessage.set(this.translationService.translate('invoice.paymentAmountError'));
      return;
    }

    if (!this.canPay()) {
      this.errorMessage.set(this.translationService.translate('invoice.paymentNotAllowed'));
      return;
    }

    if (amount > this.remainingAmount()) {
      this.errorMessage.set(this.translationService.translate('invoice.paymentExceedsBalance'));
      return;
    }

    const payload: CreatePayment = {
      amount,
      method: this.paymentMethod()
    };

    this.savingPayment.set(true);
    this.invoiceService.addPayment(this.invoiceId(), payload).subscribe({
      next: () => {
        this.successMessage.set(this.translationService.translate('invoice.paymentCreated'));
        this.paymentAmount.set(null);
        this.paymentMethod.set('CASH');
        this.loadInvoice();
        this.savingPayment.set(false);
      },
      error: error => {
        this.errorMessage.set(error?.error?.message || this.translationService.translate('invoice.paymentError'));
        this.savingPayment.set(false);
      }
    });
  }

  issueInvoice(): void {
    if (!this.canIssue() || this.actionLoading()) {
      return;
    }

    this.clearMessages();
    this.actionLoading.set(true);
    this.invoiceService.issue(this.invoiceId()).subscribe({
      next: invoice => {
        this.invoice.set(invoice);
        this.successMessage.set(this.translationService.translate('invoice.issuedSuccess'));
        this.actionLoading.set(false);
      },
      error: error => {
        this.errorMessage.set(error?.error?.message || this.translationService.translate('invoice.issueError'));
        this.actionLoading.set(false);
      }
    });
  }

  requestConfirmation(action: ConfirmationAction): void {
    this.confirmationAction.set(action);
  }

  closeConfirmation(): void {
    this.confirmationAction.set(null);
  }

  executeConfirmedAction(): void {
    const action = this.confirmationAction();

    if (!action || this.actionLoading()) {
      return;
    }

    this.clearMessages();
    this.actionLoading.set(true);

    if (action === 'cancel') {
      this.invoiceService.cancel(this.invoiceId()).subscribe({
        next: invoice => {
          this.invoice.set(invoice);
          this.successMessage.set(this.translationService.translate('invoice.cancelledSuccess'));
          this.actionLoading.set(false);
          this.closeConfirmation();
        },
        error: error => this.handleActionError(error, 'invoice.cancelError')
      });
      return;
    }

    this.invoiceService.delete(this.invoiceId()).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: error => this.handleActionError(error, 'invoice.deleteError')
    });
  }

  confirmationTitle(): string {
    return this.translationService.translate(
      this.confirmationAction() === 'delete' ? 'invoice.confirmDeleteTitle' : 'invoice.confirmCancelTitle'
    );
  }

  confirmationMessage(): string {
    return this.translationService.translate(
      this.confirmationAction() === 'delete' ? 'invoice.confirmDeleteMessage' : 'invoice.confirmCancelMessage'
    );
  }

  openPdf(): void {
    this.clearMessages();
    this.downloadingPdf.set(true);

    this.invoiceService.getPdf(this.invoiceId()).subscribe({
      next: pdf => {
        const url = URL.createObjectURL(pdf);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        this.downloadingPdf.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('invoice.pdfError'));
        this.downloadingPdf.set(false);
      }
    });
  }

  statusClass(status?: string): string {
    return `status-${(status || 'unknown').toLowerCase()}`;
  }

  private loadInvoice(): void {
    this.loading.set(true);
    const id = this.invoiceId();

    this.invoiceService.getById(id).subscribe({
      next: invoice => {
        this.invoice.set(invoice);
        this.loadPayments(id);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('invoice.loadError'));
        this.loading.set(false);
      }
    });
  }

  private loadPayments(invoiceId: number): void {
    this.invoiceService.getPayments(invoiceId).subscribe({
      next: payments => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('invoice.paymentsLoadError'));
        this.loading.set(false);
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private handleActionError(error: any, fallbackKey: string): void {
    this.errorMessage.set(error?.error?.message || this.translationService.translate(fallbackKey));
    this.actionLoading.set(false);
    this.closeConfirmation();
  }
}
