import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoiceService';
import { CreateInvoice } from '../../models/invoice';

interface InvoiceFormItem {
  productId: number | null;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-invoice-form',
  imports: [FormsModule],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceForm {
  private invoiceService = inject(InvoiceService);

  customerId = signal<number | null>(null);
  items = signal<InvoiceFormItem[]>([
    {
      productId: null,
      quantity: 1,
      price: 0
    }
  ]);

  total = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.quantity * item.price), 0);
  });

  updateItemProductId(index: number, productId: number | null): void {
    this.items.update(items => {
      const updated = [...items];
      updated[index].productId = productId;
      return updated;
    });
  }

  updateItemQuantity(index: number, quantity: number): void {
    this.items.update(items => {
      const updated = [...items];
      updated[index].quantity = quantity;
      return updated;
    });
  }

  updateItemPrice(index: number, price: number): void {
    this.items.update(items => {
      const updated = [...items];
      updated[index].price = price;
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
    if (this.customerId() === null) {
      alert('Debe ingresar el cliente');
      return;
    }

    const hasInvalidItem = this.items().some(item =>
      item.productId === null || item.quantity <= 0
    );

    if (hasInvalidItem) {
      alert('Verifique los productos y cantidades');
      return;
    }

    const payload: CreateInvoice = {
      customer: { id: this.customerId()! },
      items: this.items().map(item => ({
        product: { id: item.productId! },
        quantity: item.quantity
      }))
    };

    this.invoiceService.create(payload).subscribe({
      next: (response) => {
        console.log('Factura creada:', response);
        alert('Factura creada correctamente');

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
        alert('Error al guardar la factura');
      }
    });
  }
}
