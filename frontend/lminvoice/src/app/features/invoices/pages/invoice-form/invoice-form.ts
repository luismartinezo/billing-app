import { CurrencyPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Customer } from '../../../customers/models/customer';
import { CustomerService } from '../../../customers/services/customer.service';
import { Product } from '../../../products/models/product';
import { ProductService } from '../../../products/services/product.service';
import { InvoiceService } from '../../services/invoiceService';
import { CreateInvoice } from '../../models/invoice';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { TranslationService } from '../../../../core/i18n/translation.service';

interface InvoiceFormItem {
  productId: number | null;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-invoice-form',
  imports: [FormsModule, RouterLink, CurrencyPipe, TranslatePipe],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceForm {
  private invoiceService = inject(InvoiceService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  customerId = signal<number | null>(null);
  customers = signal<Customer[]>([]);
  products = signal<Product[]>([]);
  loadingCatalogs = signal(true);
  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  items = signal<InvoiceFormItem[]>([
    {
      productId: null,
      quantity: 1,
      price: 0
    }
  ]);

  subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.quantity * item.price), 0);
  });
  taxAmount = computed(() => this.subtotal() * 0.19);
  total = computed(() => this.subtotal() + this.taxAmount());
  selectedCustomer = computed(() => {
    return this.customers().find(customer => customer.id === this.customerId()) ?? null;
  });

  constructor() {
    this.loadCatalogs();
  }

  updateItemProductId(index: number, productId: number | null): void {
    const selectedProductId = productId === null ? null : Number(productId);
    const selectedProduct = this.products().find(product => product.id === selectedProductId);

    this.items.update(items => {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        productId: selectedProductId,
        price: selectedProduct?.price ?? 0
      };
      return updated;
    });
  }

  updateItemQuantity(index: number, quantity: number): void {
    this.items.update(items => {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        quantity: Number(quantity)
      };
      return updated;
    });
  }

  addItem(): void {
    this.items.update(items => [...items, {
      productId: null,
      quantity: 1,
      price: 0
    }]);
  }

  removeItem(index: number): void {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.customerId() === null) {
      this.errorMessage.set(this.translationService.translate('invoice.validationCustomer'));
      return;
    }

    const hasInvalidItem = this.items().some(item =>
      item.productId === null || item.quantity <= 0
    );

    if (hasInvalidItem) {
      this.errorMessage.set(this.translationService.translate('invoice.validationItems'));
      return;
    }

    const payload: CreateInvoice = {
      customer: { id: this.customerId()! },
      items: this.items().map(item => ({
        product: { id: item.productId! },
        quantity: item.quantity
      }))
    };

    this.saving.set(true);
    this.invoiceService.create(payload).subscribe({
      next: (response) => {
        console.log('Factura creada:', response);
        this.successMessage.set(this.translationService.translate('invoice.created'));
        this.saving.set(false);

        this.customerId.set(null);
        this.items.set([
          {
            productId: null,
            quantity: 1,
            price: 0
          }
        ]);
      },
      error: (error) => {
        console.error('Error al crear factura:', error);
        this.errorMessage.set(this.translationService.translate('invoice.saveError'));
        this.saving.set(false);
      }
    });
  }

  goToInvoices(): void {
    this.router.navigate(['/invoices']);
  }

  productName(productId: number | null): string {
    return this.products().find(product => product.id === productId)?.name
      ?? this.translationService.translate('invoice.noSelectedProduct');
  }

  private loadCatalogs(): void {
    this.loadingCatalogs.set(true);
    forkJoin({
      customers: this.customerService.getAll(),
      products: this.productService.getAll()
    }).subscribe({
      next: ({ customers, products }) => {
        this.customers.set(customers);
        this.products.set(products);
        this.loadingCatalogs.set(false);
      },
      error: () => {
        this.errorMessage.set(this.translationService.translate('invoice.catalogsError'));
        this.loadingCatalogs.set(false);
      }
    });
  }
}
